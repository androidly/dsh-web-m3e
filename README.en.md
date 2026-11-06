# dsh-web-m3e

A Material 3 Expressive theme plugin for the DeepSeekRuntime (dsh) Web UI.

> 中文: [README.md](README.md)

## How it works

The plugin does not register a new theme. It layers theme tokens on top of whatever
theme is active, using `theme.overrideTokens()`:

- `light` / `dark` / `system` keep working — switching the preference switches the M3
  scheme that is composed on top;
- layout plugins such as `dsh-web-mobile-fix` are unaffected (they change layout, this
  changes colour and geometry);
- disabling the plugin restores the stock look (token layer and stylesheet are removed
  together on unload);
- no user preference is written, so the host owns the light/dark choice.

Two layers:

1. **Design tokens** (`ROLES` / `ALIASES` / `DESIGN` in `client.js`)
   - 55 Material 3 colour roles (`--dsw-m3e-primary`, `--dsw-m3e-surface-container`, …,
     one set per scheme);
   - all 114 host `--dsw-alias-*` aliases mapped onto those roles, including the ones
     that only show up on demand (document preview, code diffs, empty-state
     illustrations, onboarding, media toolbars) — 197 tokens in total;
   - the geometry/motion primitives the host already consumes: `--dsw-radius-*`
     (4/8/12/16/28), `--dsw-elevation-*` (`md.sys.elevation` levels 1/3/5),
     `--ds-ease-in-out` (`md.sys.motion.easing.standard`), `--ds-transition-duration*`
     (short2/short4/medium2 = 100/200/300 ms), `--dsw-focus-ring-color`,
     `--dsw-focus-ring-width` (2px → 3px).
2. **Stylesheet** (only where a token cannot express the rule)
   - `corner-shape: squircle` for the expressive silhouette (Chromium 139+, older
     engines fall back to plain radii);
   - composer treated as an M3 filled text field: tonal container, elevation on focus;
   - send button becomes an M3 filled button labelled with `on-primary` (the host
     hard-codes `#fff`, which is unreadable on the dark scheme);
   - press feedback: spring curve + M3 state layer;
   - touch browsers: safe-area margins so the composer clears the home indicator,
     ≥16px inputs under `pointer: coarse` (no iOS focus zoom), 36px icon targets,
     28px drawer radius, `overscroll-behavior: contain`;
   - dialogs expand from the point that was pressed (`scale(0.84)→1`, 220 ms,
     M3 emphasized-decelerate) instead of scaling up in the middle of the screen;
   - popup surfaces (model picker, permission picker, slash and context menus, the
     three-dot menu) become M3 menus: opaque tonal container (the 40px backdrop blur
     is removed), `md.sys.elevation` level 2, 44px rows (48px on touch), 16px padding,
     20px icons, label-large text, and a tonal `secondary-container` highlight for the
     selected row instead of an 8% overlay; tooltips use inverse surface with a paired
     foreground (the host hard-codes white text, invisible on the light inverse
     surface).

## Entry point

Settings → General → Material 3 theme, next to the built-in Appearance row:

- three mode cubes (light / dark / system) that write the host preference;
- a switch that retracts both plugin layers and restores the stock UI, remembered in
  `localStorage["dsh-web-m3e.enabled"]`.

## Install

From a local checkout:

```bash
dsh plugin add /path/to/dsh-web-m3e
```

or from git once published:

```bash
dsh plugin add github:<owner>/dsh-web-m3e
```

A page refresh is enough to pick up a new build; no server restart is needed (client
bundles are revision-hashed).

## Disable / uninstall

Three levels: the in-app switch → disable the plugin → remove it.

## Changing the seed colour

The colour table is generated, not hand-written. Re-run the generator with your seed
(see `gen-roles.mjs` in the Chinese README) and splice the result back into `ROLES`.
Note that `SchemeExpressive` intentionally detaches the palette from the seed hue, so
the plugin uses `SchemeTonalSpot` to keep the familiar M3 purple.

## Why only entrance animation

An exit transition is impossible from CSS alone: the host renders dialogs as
`open && <Panel/>`, so React removes the node in the same commit that starts the
closing state. Only entrance motion is implemented, and it only animates `transform` —
an earlier version faded the panel over its own scrim, which read as ghosting.

## Known limitations

- `corner-shape` needs Chromium 139+; Firefox/Safari keep plain radii.
- The plugin only changes appearance, not layout; narrow-screen layout belongs to
  `dsh-web-mobile-fix`.
- Settings-row copy follows `navigator.language`, not the host i18n dictionary.

## Licence

MIT, see [LICENSE](LICENSE).
