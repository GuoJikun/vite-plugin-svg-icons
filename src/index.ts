import path from "node:path";
import fs from "node:fs";
import type { FSWatcher } from "node:fs";

import { type Config as SvgoConfig, optimize } from "svgo";

export interface Config {
    watch?: boolean; // 是否监听 dir 目录中的文件变化
    dir: string; // SVG 图标目录
    prefix?: string; // 图标 ID 前缀
    svgoConfig?: SvgoConfig; // SVGO 配置
}

/**
 * 监听 SVG 图标目录的文件变化
 * @param dir - SVG 图标目录路径
 * @param onChange - 文件变化时的回调函数
 * @returns FSWatcher 实例，可用于停止监听
 */
const watchSvgDirectory = (
    dir: string,
    onChange: (eventType: string, filename: string | null) => void
): FSWatcher | null => {
    if (!fs.existsSync(dir)) {
        console.warn(`Cannot watch directory (not found): ${dir}`);
        return null;
    }

    console.log(`Watching SVG directory for changes: ${dir}`);

    const watcher = fs.watch(
        dir,
        { recursive: false },
        (eventType, filename) => {
            if (filename && filename.endsWith(".svg")) {
                console.log(`SVG file ${eventType}: ${filename}`);
                onChange(eventType, filename);
            }
        }
    );

    return watcher;
};

/**
 * SVG 图标插件
 * @param config
 * @returns
 */
const svgIconsPlugin = (config: Config) => {
    const {
        dir: iconsDir,
        prefix = "icon",
        svgoConfig = {},
        watch = false,
    } = config;
    const { plugins = [], ...svgoTopConfig } = svgoConfig;
    let watcher: FSWatcher | null = null;

    console.log(`SVG Icons Plugin initialized with directory: ${iconsDir}`);

    // 读取并合并所有 SVG 文件
    const loadAllSvgIcons = () => {
        if (!fs.existsSync(iconsDir)) {
            console.warn(`SVG icons directory not found: ${iconsDir}`);
            return "";
        }

        const svgFiles = fs
            .readdirSync(iconsDir)
            .filter((file) => file.endsWith(".svg"));

        if (svgFiles.length === 0) {
            console.warn(`No SVG files found in: ${iconsDir}`);
            return "";
        }

        console.log(`Found ${svgFiles.length} SVG files`);

        const symbols = svgFiles
            .map((filename) => {
                const filePath = path.join(iconsDir, filename);
                const svgContent = fs.readFileSync(filePath, "utf-8");
                const iconName = filename.replace(".svg", "");

                // 使用 svgo 优化 SVG
                const defaultSvgoPluginConfig = [
                    "preset-default",
                    "removeXMLNS",
                    "removeTitle",
                ];

                const mergedSvgoConfig: SvgoConfig = {
                    ...svgoTopConfig,
                    plugins: [...defaultSvgoPluginConfig, ...plugins] as any[],
                };
                const optimizedSvg = optimize(svgContent, mergedSvgoConfig);

                const optimizedContent = optimizedSvg.data;

                // 提取 SVG 标签的属性和内容
                const svgMatch = optimizedContent.match(
                    /<svg[^>]*>([\s\S]*)<\/svg>/i
                );
                if (svgMatch) {
                    const svgAttrs = optimizedContent.match(/<svg([^>]*)>/i);
                    let viewBox = "";

                    if (svgAttrs && svgAttrs[1]) {
                        const viewBoxMatch = svgAttrs[1].match(
                            /viewBox=["']([^"']*)["']/i
                        );
                        if (viewBoxMatch) {
                            viewBox = ` viewBox="${viewBoxMatch[1]}"`;
                        }
                    }

                    const innerContent = svgMatch[1];
                    return `<symbol id="${prefix}-${iconName}"${viewBox}>${innerContent}</symbol>`;
                }

                return "";
            })
            .filter(Boolean)
            .join("\n    ");

        // 创建 SVG sprite
        const svgSprite = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0; overflow: hidden;">
    ${symbols}
</svg>`;

        return svgSprite;
    };

    return {
        name: "vite-plugin-svg-icons",
        configureServer(server: any) {
            // 如果开启了 watch 选项，监听 SVG 目录的变化
            if (watch) {
                watcher = watchSvgDirectory(iconsDir, (eventType, filename) => {
                    // 触发热更新
                    server.ws.send({
                        type: "full-reload",
                        path: "*",
                    });
                });
            }
        },
        buildEnd() {
            // 构建结束时关闭文件监听
            if (watcher) {
                watcher.close();
                console.log("Stopped watching SVG directory");
            }
        },
        transformIndexHtml(html: string) {
            const svgSprite = loadAllSvgIcons();

            if (svgSprite) {
                // 在 body 结束标签前插入 SVG sprite
                return html.replace("</body>", `  ${svgSprite}\n  </body>`);
            }

            return html;
        },
    };
};
export default svgIconsPlugin;
