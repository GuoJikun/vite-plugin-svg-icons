# vite-plugin-svg-icons

A Vite plugin to efficiently manage SVG icons by automatically converting SVG files into SVG sprites.

[简体中文](./README.md) | English

## Features

✨ **Automated** - Automatically scan directories and generate SVG sprites  
🔥 **Hot Reload** - Support file watching and hot updates in development mode  
⚡️ **Optimized** - Built-in SVGO optimization to reduce file size  
🎯 **Type Safe** - Full TypeScript type support  
🔧 **Configurable** - Flexible configuration options to meet different needs

## Installation

```bash
# npm
npm install @jkun/vite-plugin-svg-icons -D

# pnpm
pnpm add @jkun/vite-plugin-svg-icons -D

# yarn
yarn add @jkun/vite-plugin-svg-icons -D
```

## Quick Start

### 1. Configure Plugin

Add the plugin in `vite.config.js`:

```js
import { defineConfig } from "vite";
import svgIconPlugin from "@jkun/vite-plugin-svg-icons";

export default defineConfig({
    plugins: [
        svgIconPlugin({
            dir: "src/assets/icons", // SVG icons directory
        }),
    ],
});
```

### 2. Prepare SVG Icons

Place your SVG files in the specified directory:

```
src/assets/icons/
├── home.svg
├── user.svg
└── settings.svg
```

### 3. Use Icons

Use the SVG sprite in HTML:

```html
<!-- Using default prefix 'icon' -->
<svg class="icon">
    <use xlink:href="#icon-home"></use>
</svg>

<svg class="icon">
    <use xlink:href="#icon-user"></use>
</svg>
```

Add styles:

```css
.icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
}
```

## Configuration Options

### `dir`

-   Type: `string`
-   **Required**

Path to the directory containing SVG icons. The plugin will read all `.svg` files in this directory.

```js
svgIconPlugin({
    dir: "src/assets/icons",
});
```

### `watch`

-   Type: `boolean`
-   Default: `false`
-   Optional

Whether to watch for file changes in the `dir` directory in development mode. When enabled, page hot updates will be triggered automatically when SVG files change.

```js
svgIconPlugin({
    dir: "src/assets/icons",
    watch: true,
});
```

### `prefix`

-   Type: `string`
-   Default: `'icon'`
-   Optional

Prefix for generated icon IDs. For example, if the prefix is `icon` and the filename is `home.svg`, the generated icon ID will be `icon-home`.

```js
svgIconPlugin({
    dir: "src/assets/icons",
    prefix: "my-icon",
});
```

Usage:

```html
<svg>
    <use xlink:href="#my-icon-home"></use>
</svg>
```

### `svgoConfig`

-   Type: `SvgoConfig`
-   Default: `{}`
-   Optional

[SVGO](https://github.com/svg/svgo) optimization configuration. The plugin uses SVGO to optimize SVG files, and you can customize the optimization configuration through this option.

By default, the plugin uses the following plugins:

-   `preset-default`
-   `removeXMLNS`
-   `removeTitle`

You can add more configurations via `svgoConfig`:

```js
svgIconPlugin({
    dir: "src/assets/icons",
    svgoConfig: {
        plugins: [
            {
                name: "removeAttrs",
                params: {
                    attrs: "(fill|stroke)",
                },
            },
        ],
    },
});
```

## Complete Configuration Example

```js
import svgIconPlugin from "@jkun/vite-plugin-svg-icons";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        svgIconPlugin({
            dir: "src/assets/icons",
            watch: true,
            prefix: "icon",
            svgoConfig: {
                plugins: [
                    {
                        name: "removeAttrs",
                        params: {
                            attrs: "(fill|stroke)",
                        },
                    },
                ],
            },
        }),
    ],
});
```

## How It Works

During the build process, the plugin:

1. Scans all `.svg` files in the specified directory
2. Optimizes each SVG file using SVGO
3. Converts SVGs to `<symbol>` tags
4. Generates an SVG sprite containing all icons
5. Automatically injects it at the end of the HTML `<body>` tag

Generated sprite format:

```html
<svg
    xmlns="http://www.w3.org/2000/svg"
    style="position: absolute; width: 0; height: 0; overflow: hidden;">
    <symbol id="icon-home" viewBox="0 0 24 24">
        <!-- SVG content -->
    </symbol>
    <symbol id="icon-user" viewBox="0 0 24 24">
        <!-- SVG content -->
    </symbol>
</svg>
```

## Development

-   Install dependencies

```bash
pnpm i
```

-   Build library

```bash
pnpm build
```

## FAQ

### Icons not showing?

1. Check if the SVG file path is correct
2. Ensure SVG file format is valid
3. Verify icon ID matches (prefix + filename)
4. Check browser console for errors

### How to customize icon colors?

Remove `fill` and `stroke` attributes from SVG files, then control via CSS:

```js
svgIconPlugin({
    dir: "src/assets/icons",
    svgoConfig: {
        plugins: [
            {
                name: "removeAttrs",
                params: {
                    attrs: "(fill|stroke)",
                },
            },
        ],
    },
});
```

Using CSS:

```css
.icon {
    fill: #ff6b6b; /* Custom color */
}
```

### How to use in Vue/React?

**Vue:**

```vue
<template>
    <svg class="icon">
        <use :xlink:href="`#icon-${name}`"></use>
    </svg>
</template>

<script setup>
defineProps({
    name: String,
});
</script>
```

**React:**

```jsx
function Icon({ name }) {
    return (
        <svg className="icon">
            <use xlinkHref={`#icon-${name}`}></use>
        </svg>
    );
}
```

## License

[MIT](./LICENSE)

## Related Links

-   [GitHub Repository](https://github.com/GuoJikun/vite-plugin-svg-icons)
-   [Issue Tracker](https://github.com/GuoJikun/vite-plugin-svg-icons/issues)
-   [SVGO Documentation](https://github.com/svg/svgo)
