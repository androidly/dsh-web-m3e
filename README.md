# dsh-web-m3e

Material 3 Expressive (M3E) 主题，用于 DeepSeekRuntime Web UI。

> English: [README.en.md](README.en.md)

## 做了什么

插件不注册新主题，而是用 `theme.overrideTokens()` 在**当前主题之上**叠一层 token，
因此：

- `浅色 / 深色 / 跟随系统` 三种偏好继续有效，切换配色时自动换到对应的 M3 方案；
- 与 `dsh-web-mobile-fix` 之类的布局插件互不干扰（它改布局，本插件改配色与几何）；
- 关掉插件即恢复原生外观（卸载时图层与样式表一起撤除）；
- 不写用户偏好设置，明暗选择始终归宿主管。

分两部分：

1. **设计令牌层**（`client.js` 的 `ROLES` / `ALIASES` / `DESIGN`）
   - 55 个 Material 3 颜色角色（`--dsw-m3e-primary`、`--dsw-m3e-surface-container` …，浅/深各一套）；
   - 把宿主调色板的全部 114 个 `--dsw-alias-*` 别名映射到这些角色（含文档预览、代码 diff、
     空状态插画、引导页、媒体工具条这些不常露面的边角），共 197 个 token；
   - 覆盖宿主已经在用的几何/动效原语：`--dsw-radius-*`（4/8/12/16/28）、
     `--dsw-elevation-*`（`md.sys.elevation` 的 level 1/3/5 阴影）、
     `--ds-ease-in-out`（`md.sys.motion.easing.standard`）、
     `--ds-transition-duration*`（short2 / short4 / medium2 = 100 / 200 / 300ms）、
     `--dsw-focus-ring-color`、`--dsw-focus-ring-width`（2px → 3px，`md.sys.state.focus-indicator.thickness`）。
2. **样式表层**（只在 token 表达不了的地方出手）
   - `corner-shape: squircle`：M3E 的方圆形轮廓（Chrome 139+，旧内核自动退回圆角）；
   - 输入区（composer）按 M3 filled text field 处理：tonal 容器 + 聚焦时抬升；
   - 发送按钮改成 M3 填充按钮，文字用 `on-primary`（宿主写死 `#fff`，在深色方案里不可读）；
   - 按压反馈：spring 曲线 `scale(0.94)` + M3 state layer（`inset` 阴影画在内容之下）；
   - 触摸浏览器：`safe-area-inset`（用附加外边距，不改宿主 `padding`）让输入区避开 Home indicator、`pointer: coarse` 下
     输入框 ≥16px（防移动 Safari 聚焦缩放）、图标按钮 36px 命中区、
     抽屉右侧 28px 圆角、`overscroll-behavior: contain`；
   - 浮层入场动效：对话框从**按下的那个点**展开（`scale(0.84)→1`，220ms，M3 emphasized-decelerate），
     像气球从点击位置鼓出来，而不是在屏幕中央整体放大；
   - 弹层（模型选择、权限选择、斜杠/上下文菜单、三个点菜单）改成 M3 菜单：
     不透明 tonal 容器（去掉 40px 背景模糊）、`md.sys.elevation` level 2、44px 行高
     （触摸下 48px）、左右 16px 内缩、20px 图标、label-large 文字，选中行用
     `secondary-container` 的 tonal 高亮而不是 8% 蒙层；提示气泡（tooltip）
     用 inverse surface + 成对前景色（宿主写死白字，在浅色 inverse surface 上看不见）。


## 弹层（菜单 / 选择器 / 提示）

模型选择、权限选择、斜杠命令、`@` 引用、右键菜单、右上角三个点，全部由宿主
`@deepseek-ai/dsh-client-ui-primitives` 的 `Menu` 渲染，画在一个自己合成的层上：

| 宿主写法 | 原来的样子 | 本插件改成 |
|---|---|---|
| `--dsw-menu-surface-fill` | `#fcfdfeb3`（70% 白） | `surface-container-high`，完全不透明 |
| `--dsw-menu-backdrop-filter` | `blur(40px) saturate(150%)` | `none` |
| `[data-menu-material]` 外层 `box-shadow` | `--dsw-elevation-prominent`（level 5） | `--dsw-m3e-elevation-2`（level 2） |
| 菜单行 | 34px 高、13px 字、14px 图标 | 44px（触摸 48px）、label-large 14/20 500、20px 图标、左右 16px |
| 选中行 | `interactive-bg-hover`（8% 蒙层） | `secondary-container` + `on-secondary-container` |
| `[role="tooltip"]` | 13/20、圆角 8、写死白字 | 12/16、圆角 4、`label-primary-inverted` 成对前景色 |

这三项（fill / blur / elevation）都通过宿主自己的自定义属性与选择器生效，不复制宿主的
组件 DOM，也不和宿主抢同一棵子树。菜单的入场淡入是宿主自己按 `data-menu-phase`
播放的（40ms，`replace` 时 10ms），本插件不插手——这正是 v1.2.1 踩过的坑。

## 动效的边界（为什么只有入场，而且只有位移）

- **能做**：节点被插入 DOM 那一刻，CSS 动画会自然播放一次，所以入场动效纯 CSS 就够；
- **"从点击位置展开"需要一点点 JS**：`transform-origin` 是相对元素自身盒子的，而点击点是页面坐标，
  两者之间要减掉 `getBoundingClientRect()`。这段必须发生在浏览器**绘制第一帧之前**，所以用的是
  `MutationObserver` 的回调（插入后、渲染前，唯一够早的时机），由它把点击点换算成面板内部坐标，
  写成 `--m3e-origin-x/-y` 内联变量，CSS 只负责 `transform-origin: var(--m3e-origin-x, 50%) …`。
  键盘打开（Enter/空格）没有点击点，就退回从中心展开；点不到面板内部时按边缘夹取，观感仍然是"从那边长出来"；
- **不能做退场**：关闭时宿主写的是 `open && <Panel/>`，React 在同一个提交里移除节点，
  没有元素留给 CSS 过渡。合规插件不该拦截/克隆宿主 DOM，所以退场只能是硬切；
- **不加淡入**（v1.2.1 的教训）：面板在自己的遮罩上做 300ms 透明度过渡时，那 300ms 里
  看到的是"半透明的面板"——观感就是残影/过渡帧；遮罩本身若挂 `backdrop-filter`，
  对它做透明度动画还会把模糊层拖出痕迹。所以对话框只做位移与缩放，不做透明度；
- **不给菜单/下拉加动画**：宿主会随列表更新反复重建这些浮层，任何入场动画都会重播成闪烁；
- 抽屉、侧栏、明暗切换这些宿主本来就带 transition 的地方，因为我们把
  `--ds-ease-in-out` 与 `--ds-transition-duration*` 换成了 M3 的值，已经自动走 M3 曲线；
- 手机全屏对话框同样从点击位置展开：面板缩小时露出的是它自己的遮罩，而不是页面内容，
  这正是 Android 上 dialog 的观感；曾经的上浮 24px 方案已删除（读起来还是"突然出现"）；
- 全部动效挂在 `prefers-reduced-motion: no-preference` 下：系统开"减少动态效果"即整体关闭，
  也是最快的 A/B 开关。

## 入口：设置 → 通用 → 外观

插件往 `settings.general.item` 槽注册了一行（`order: 9`，位于宿主的「语言」与「外观」之间，
标题 `Material 3 主题`）：

- **明暗**：`浅色 / 深色 / 跟随系统` 三个方块，直接调 `theme.setTheme()`，写入的是宿主的偏好，刷新后保持；
- **Material 3 配色**：开关，控制本插件的 token 图层与样式表。关掉立即回到原生外观，
  明暗偏好不动；状态存在 `localStorage` 的 `dsh-web-m3e.enabled`，刷新后保持。

手机上设置面板是全屏的，从侧栏底部进设置即可，同一行布局自动换行。

> 只想改明暗、不想动插件？宿主本来就有入口：设置 → 通用 → 外观，效果一样。

## 安装

```bash
# 在 dsh 会话里
plugin_manager action=install_bundle target=/绝对路径/dsh-web-m3e
```

从 GitHub 安装（发布后）：

```bash
plugin_manager action=install_bundle target=github:androidly/dsh-web-m3e
```

或把它放进 profile 的 bundles 列表。包结构是标准 DSH bundle：
`package.json → dsh.bundle.patch → cordis.patch.yml → insert: web-m3e`，
浏览器半边经 `exports["./client"]` + `dsh.client` 声明发现。

## 卸载 / 关闭

三种层次，按需要选：

1. 设置 → 通用 → 外观 → 「Material 3 配色」开关关掉：只停配色，插件仍在（可随时开回来，状态会记住）；
2. 插件管理里禁用 `Material 3 主题`：整包停用，设置页那一行也一起消失；
3. 从 profile 移除 `dsh-web-m3e`：彻底卸载。

图层与样式表的 disposer 都挂在该插件的 fiber 上，禁用后立即恢复原生配色。

## 换种子色

`ROLES` 是官方实现生成的整表，不要手改其中单个色值（会破坏 tone 与对比度的一致性）。
正确做法是换种子重新生成：

```bash
npm i @material/material-color-utilities@0.4.0   # 或离线解包 tarball
node -e '
const {Hct, SchemeTonalSpot, argbFromHex, hexFromArgb, MaterialDynamicColors: M} = await import("@material/material-color-utilities");
for (const dark of [false, true]) {
  const s = new SchemeTonalSpot(Hct.fromInt(argbFromHex("#00639c")), dark, 0);
  console.log(dark ? "dark" : "light", M.primary.getArgb(s), M.surfaceContainer.getArgb(s));
}'
```

把生成结果贴回 `client.js` 的 `ROLES` 即可，`ALIASES` 里所有 `var(--dsw-m3e-*)`
引用会自动跟随。同一个 seed 想换风格，把 `SchemeTonalSpot` 换成
`SchemeExpressive`（M3E 官方变体，会刻意偏离种子色相）或 `SchemeFruitSalad`。

## 依据：这些数值是哪来的

不是凭印象调的颜色，全部来自 Google 官方实现，可复现：

| 内容 | 来源 |
| --- | --- |
| 54 个颜色角色（浅/深） | `@material/material-color-utilities@0.4.0`，`new SchemeTonalSpot(Hct.fromInt(argbFromHex("#6750a4")), isDark, 0)` |
| 形状比例 4 / 8 / 12 / 16 / 28 | `@material/web@2.5.0` → `tokens/versions/latest/sass/_md-sys-shape.scss`（`md.sys.shape.corner.*`，含 M3E 的 `extra-extra-large: 48px`） |
| 高度阴影 level 1/3/5 | `md.sys.elevation` 的 dp 层级 → umbra `30%` + penumbra `15%` 双层阴影 |
| 缓动与时长 | `_md-sys-motion.scss`：`easing-standard: cubic-bezier(0.2, 0, 0, 1)`、`short2 100ms` / `short4 200ms` / `medium2 300ms`、对话框入场用 `emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1)` |
| state layer 透明度 | `_md-sys-state.scss`：hover 8% / focus 10% / pressed 10% / dragged 16%，作用在内容色（`on-surface`）上 |
| 状态色 success / warn | M3 没有这两个角色，用同族种子（`#146c2e` / `#8a5300`）跑同一套 `SchemeTonalSpot`，保证 tone 与对比度和主色一致 |

配色的可读性有回归检查（`.check/contrast.mjs`）：17 组前景/背景配对 × 浅深两套，
全部满足 WCAG AA（正文 4.5:1、状态色 3:1）。

**没有改字体**：宿主的字号阶梯（11/14、12/18、13/20、14/22、16/24、20/28、24/32）
本就和 M3 typescale 接近，而行高一旦按 M3 的 15 个角色重排，聊天区行距会整体变化，
这是布局层面的改动，不属于"换主题"该做的事。

## 已知限制

- `corner-shape` 依赖 Chromium 139+；Firefox/Safari 保留普通圆角（宿主本身也在用它）。
- 本插件只改观感，不改布局；窄屏布局由 `dsh-web-mobile-fix` 负责。
- 设置行的文案跟随浏览器语言（`navigator.language` 以 `zh` 开头即中文），未接宿主的 i18n 字典。

## 目录

```
dsh-web-m3e/
├── client.js           # 浏览器半边：角色表、别名映射、几何/动效令牌、样式表、设置行
├── index.js            # 宿主半边（空实现，仅满足 bundle 约定）
├── cordis.patch.yml    # bundle 补丁：向 profile 插入 web-m3e 这一行
├── locale/en.json      # 插件列表里的标题与说明（英文）
├── locale/zh.json      # 同上（中文）
├── icon.svg            # 插件图标
└── package.json
```

## 版本

- `1.5.0` 补齐宿主调色板剩余 39 个别名（文档预览 / diff / 插画 / 引导 / 媒体工具条）、
  焦点环 3px、侧栏渐变改为 M3 主色、设置行开关与选中态修正（浅色下白色滑块不可见）。
- `1.4.0` 弹层跟随 M3：不透明 tonal 容器、去掉 40px 模糊、level 2 阴影、44/48px 行高、
  tonal 选中行、tooltip 前景色修正。
- `1.3.0` 配色改由官方算色库生成（`SchemeTonalSpot`，seed `#6750a4`），几何/动效对齐
  `md.sys` 规范值。
- `1.2.1` 去掉面板淡入与菜单动画（残影 / 闪烁）。
- `1.2.0` 设置页入口（明暗切换 + 总开关）。
- `1.1.0` 首个可用版本：M3 配色 + 触摸浏览器适配。

## 许可

MIT，见 [LICENSE](LICENSE)。
