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

## 开发

- 安装依赖

```bash
pnpm i
```

- 构建库

```bash
pnpm build
```
