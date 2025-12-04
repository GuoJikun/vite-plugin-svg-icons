import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

import { type Config as SvgoConfig, optimize } from "svgo";

export interface Config {
    dir: string; // SVG图标目录
    prefix?: string; // 图标ID前缀
    svgoConfig?: SvgoConfig; // SVGO配置
}
/**
 * SVG图标插件
 * @param config
 * @returns
 */
const svgIconsPlugin = (config: Config) => {
    const { dir: iconsDir, prefix = "icon", svgoConfig = {} } = config;
    const { plugins = [], ...svgoTopConfig } = svgoConfig;

    console.log(`SVG Icons Plugin initialized with directory: ${iconsDir}`);

    // 读取并合并所有SVG文件
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

                // 使用svgo优化SVG
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

                // 提取SVG标签的属性和内容
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

        // 创建SVG sprite
        const svgSprite = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0; overflow: hidden;">
    ${symbols}
</svg>`;

        return svgSprite;
    };

    return {
        name: "vite-plugin-svg-icons",
        transformIndexHtml(html: string) {
            const svgSprite = loadAllSvgIcons();

            if (svgSprite) {
                // 在body结束标签前插入SVG sprite
                return html.replace("</body>", `  ${svgSprite}\n  </body>`);
            }

            return html;
        },
    };
};
export default svgIconsPlugin;
