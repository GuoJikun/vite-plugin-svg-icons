# vite-plugin-svg-icons

A Vite plugin to manage SVG icons efficiently.

## 使用

```js
import svgIconPlugin from '@jkun/vite-plugin-svg-icons'

export default defineConfig({
    return {
        plugins: [svgIconPlugin({
            dir: ''
        })]
    }
})
```

### 配置选项

#### `dir`

-   类型：`string`
-   **必填**

SVG 图标所在的目录路径。插件会读取该目录下的所有 `.svg` 文件。

```js
svgIconPlugin({
    dir: 'src/assets/icons'
})
```

#### `watch`

-   类型：`boolean`
-   默认值：`false`
-   可选

是否在开发模式下监听 `dir` 目录中的文件变化。开启后，当目录中的 SVG 文件发生变化时，会自动触发页面热更新。

```js
svgIconPlugin({
    dir: 'src/assets/icons',
    watch: true
})
```

#### `prefix`

-   类型：`string`
-   默认值：`'icon'`
-   可选

生成的图标 ID 前缀。例如，如果前缀为 `icon`，文件名为 `home.svg`，则生成的图标 ID 为 `icon-home`。

```js
svgIconPlugin({
    dir: 'src/assets/icons',
    prefix: 'my-icon'
})
```

使用时：

```html
<svg>
    <use xlink:href="#my-icon-home"></use>
</svg>
```

#### `svgoConfig`

-   类型：`SvgoConfig`
-   默认值：`{}`
-   可选

[SVGO](https://github.com/svg/svgo) 优化配置。插件会使用 SVGO 优化 SVG 文件，你可以通过此选项自定义优化配置。

默认情况下，插件会使用以下插件：
- `preset-default`
- `removeXMLNS`
- `removeTitle`

你可以通过 `svgoConfig` 添加更多配置：

```js
svgIconPlugin({
    dir: 'src/assets/icons',
    svgoConfig: {
        plugins: [
            {
                name: 'removeAttrs',
                params: {
                    attrs: '(fill|stroke)'
                }
            }
        ]
    }
})
```

### 完整配置示例

```js
import svgIconPlugin from '@jkun/vite-plugin-svg-icons'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        svgIconPlugin({
            dir: 'src/assets/icons',
            watch: true,
            prefix: 'icon',
            svgoConfig: {
                plugins: [
                    {
                        name: 'removeAttrs',
                        params: {
                            attrs: '(fill|stroke)'
                        }
                    }
                ]
            }
        })
    ]
})
```

## 开发

-   安装依赖

```bash
pnpm i
```

-   构建库

```bash
pnpm build
```
