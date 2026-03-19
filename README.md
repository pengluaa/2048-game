# README

## 2048规则介绍

1、手指向一个方向滑动，所有格子会向那个方向运动。
2、相同数字的两个格子，相撞时数字会相加。
3、每次滑动时，空白处会随机刷新出一个数字的格子。
4、当界面不可运动时（当界面全部被数字填满时），游戏结束；当界面中最大数字是2048时，游戏胜利。

## Node version

node version

```bash
#node
node -v
v18.16.0
```

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
