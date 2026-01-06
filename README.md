# vite-plugin-svg-icons

一个高效管理 SVG 图标的 Vite 插件，自动将 SVG 文件转换为 SVG Sprite。

简体中文 | [English](./README_EN.md)

## 特性

✨ **自动化** - 自动扫描目录并生成 SVG sprite  
🔥 **热更新** - 支持开发模式下的文件监听和热更新  
⚡️ **优化** - 内置 SVGO 优化，减小文件体积  
🎯 **类型安全** - 完整的 TypeScript 类型支持  
🔧 **可配置** - 灵活的配置选项，满足不同需求

## 安装

```bash
# npm
npm install @jkun/vite-plugin-svg-icons -D

# pnpm
pnpm add @jkun/vite-plugin-svg-icons -D

# yarn
yarn add @jkun/vite-plugin-svg-icons -D
```

## 快速开始

### 1. 配置插件

在 `vite.config.js` 中添加插件：

```js
import { defineConfig } from 'vite'
import svgIconPlugin from '@jkun/vite-plugin-svg-icons'

export default defineConfig({
    plugins: [
        svgIconPlugin({
            dir: 'src/assets/icons' // SVG 图标目录
        })
    ]
})
```

### 2. 准备 SVG 图标

在指定目录下放置你的 SVG 文件：

```
src/assets/icons/
├── home.svg
├── user.svg
└── settings.svg
```

### 3. 使用图标

在 HTML 中使用 SVG sprite：

```html
<!-- 使用默认前缀 'icon' -->
<svg class="icon">
    <use xlink:href="#icon-home"></use>
</svg>

<svg class="icon">
    <use xlink:href="#icon-user"></use>
</svg>
```

添加样式：

```css
.icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
}
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

## 工作原理

插件会在构建时：

1. 扫描指定目录下的所有 `.svg` 文件
2. 使用 SVGO 优化每个 SVG 文件
3. 将 SVG 转换为 `<symbol>` 标签
4. 生成一个包含所有图标的 SVG sprite
5. 自动注入到 HTML 的 `<body>` 标签末尾

生成的 sprite 格式：

```html
<svg xmlns="http://www.w3.org/2000/svg" style="position: absolute; width: 0; height: 0; overflow: hidden;">
    <symbol id="icon-home" viewBox="0 0 24 24">
        <!-- SVG 内容 -->
    </symbol>
    <symbol id="icon-user" viewBox="0 0 24 24">
        <!-- SVG 内容 -->
    </symbol>
</svg>
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

## 常见问题

### 图标不显示？

1. 检查 SVG 文件路径是否正确
2. 确保 SVG 文件格式正确
3. 检查图标 ID 是否匹配（前缀 + 文件名）
4. 查看浏览器控制台是否有错误

### 如何自定义图标颜色？

移除 SVG 文件中的 `fill` 和 `stroke` 属性，然后通过 CSS 控制：

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

使用 CSS：

```css
.icon {
    fill: #ff6b6b; /* 自定义颜色 */
}
```

### 如何在 Vue/React 中使用？

**Vue:**

```vue
<template>
    <svg class="icon">
        <use :xlink:href="`#icon-${name}`"></use>
    </svg>
</template>

<script setup>
defineProps({
    name: String
})
</script>
```

**React:**

```jsx
function Icon({ name }) {
    return (
        <svg className="icon">
            <use xlinkHref={`#icon-${name}`}></use>
        </svg>
    )
}
```

## 许可证

[MIT](./LICENSE)

## 相关链接

- [GitHub 仓库](https://github.com/GuoJikun/vite-plugin-svg-icons)
- [问题反馈](https://github.com/GuoJikun/vite-plugin-svg-icons/issues)
- [SVGO 文档](https://github.com/svg/svgo)
