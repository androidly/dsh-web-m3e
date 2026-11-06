/**
 * Material 3 Expressive (M3E) theme — browser half.
 *
 * Two layers, both reversible:
 *  1. a token layer (`ctx.theme.overrideTokens`) publishing a Material 3 colour
 *     scheme plus the shape/motion primitives the host stylesheets already
 *     consume (`--dsw-radius-*`, `--dsw-elevation-*`, `--ds-transition-*`), so
 *     light/dark/system preferences and every sibling plugin keep working;
 *  2. a stylesheet for the few things a token cannot express: squircle corner
 *     geometry, the composer's filled-container elevation, expressive press
 *     feedback, and touch-browser ergonomics (safe areas, 44px targets, no
 *     iOS focus zoom).
 *
 * The loader pins the override layer to this package id, and tears both layers
 * down when the plugin unloads, so disabling it restores the stock UI.
 */
window.__ModuleLoader__.load({
	id: "dsh-web-m3e",
	factory: (require) => {
		const React = require("react");
		const PACKAGE_ID = "dsh-web-m3e";

		/** One token value per colour scheme. */
		const pair = (light, dark) => ({ light, dark });
		/** Scheme-independent value (shape, motion, elevation). */
		const both = (value) => ({ light: value, dark: value });
		/** Alias that resolves through an M3 role published by this same layer. */
		const role = (name) => both(`var(--dsw-m3e-${name})`);

		/**
		 * Material 3 colour roles, generated with the official Material colour
		 * utilities — `new SchemeTonalSpot(Hct.fromInt(argbFromHex("#6750a4")))`
		 * at contrast level 0, light and dark — instead of hand-picked hex values.
		 * To change the seed colour, re-run that generator and paste the result;
		 * every alias below follows whichever roles it points at.
		 *
		 * Host status colours (success / warn / error-soft) have no M3 role of
		 * their own, so they are tonal tones from a seed of the same family: they
		 * keep M3's tone spacing and contrast instead of drifting from it.
		 *
		 * Published as `--dsw-m3e-*` so the stylesheet and any third-party UI can
		 * read the same roles the alias table is derived from.
		 */
		const ROLES = {
			primary: pair("#65558f", "#cfbdfe"),
			"on-primary": pair("#ffffff", "#36275d"),
			"primary-container": pair("#e9ddff", "#4d3d75"),
			"on-primary-container": pair("#4d3d75", "#e9ddff"),
			"inverse-primary": pair("#cfbdfe", "#65558f"),
			secondary: pair("#625b71", "#cbc2db"),
			"on-secondary": pair("#ffffff", "#332d41"),
			"secondary-container": pair("#e8def8", "#4a4458"),
			"on-secondary-container": pair("#4a4458", "#e8def8"),
			tertiary: pair("#7e5260", "#efb8c8"),
			"on-tertiary": pair("#ffffff", "#4a2532"),
			"tertiary-container": pair("#ffd9e3", "#633b48"),
			"on-tertiary-container": pair("#633b48", "#ffd9e3"),
			error: pair("#ba1a1a", "#ffb4ab"),
			"on-error": pair("#ffffff", "#690005"),
			"error-soft": pair("#de3730", "#ff897d"),
			"error-container": pair("#ffdad6", "#93000a"),
			"on-error-container": pair("#93000a", "#ffdad6"),
			surface: pair("#fdf7ff", "#141218"),
			"on-surface": pair("#1d1b20", "#e6e0e9"),
			"surface-dim": pair("#ded8e0", "#141218"),
			"surface-bright": pair("#fdf7ff", "#3b383e"),
			"surface-tint": pair("#65558f", "#cfbdfe"),
			"surface-container-lowest": pair("#ffffff", "#0f0d13"),
			"surface-container-low": pair("#f8f2fa", "#1d1b20"),
			"surface-container": pair("#f2ecf4", "#211f24"),
			"surface-container-high": pair("#ece6ee", "#2b292f"),
			"surface-container-highest": pair("#e6e0e9", "#36343a"),
			"on-surface-variant": pair("#49454e", "#cac4cf"),
			outline: pair("#7a757f", "#948f99"),
			"outline-variant": pair("#cac4cf", "#49454e"),
			"inverse-surface": pair("#322f35", "#e6e0e9"),
			"inverse-on-surface": pair("#f5eff7", "#322f35"),
			success: pair("#37693d", "#9dd49e"),
			"success-soft": pair("#527e85", "#86b3ba"),
			"success-container": pair("#b8f1b9", "#1e5128"),
			warn: pair("#845416", "#faba73"),
			"warn-label": pair("#673d00", "#ffdcbb"),
			"warn-soft": pair("#6f7c52", "#a2b182"),
			"warn-container": pair("#ffdcbb", "#673d00"),
			"state-hover": pair("#1d1b2014", "#e6e0e914"),
			"state-active": pair("#1d1b201a", "#e6e0e91a"),
			"state-dragged": pair("#1d1b2029", "#e6e0e929"),
			"state-hover-accent": pair("#65558f14", "#cfbdfe14"),
			skeleton: pair("#1d1b2014", "#e6e0e91f"),
			"border-faint": pair("#cac4cf66", "#49454e66"),
			"border-soft": pair("#7a757f3d", "#948f993d"),
			/* Menus are opaque tonal containers in M3 — no alpha, no blur. */
			"menu-fill": pair("#ece6ee", "#2b292f"),
			"menu-header-fill": pair("#f2ecf4", "#211f24"),
			scrim: pair("#00000052", "#00000080"),
			"scrim-soft": pair("#00000033", "#0000004d"),
			"scrim-strong": pair("#00000080", "#00000099"),
			shadow: both("#000000"),
			"primary-hover": both("color-mix(in srgb, var(--dsw-m3e-primary) 92%, var(--dsw-m3e-on-primary))"),
		};
		/**
		 * The host palette's alias names, remapped onto those roles. Everything
		 * the shipped UI paints comes from this table, so one mapping restyles
		 * every surface without touching a class selector.
		 */
		const ALIASES = {
			"--dsw-alias-bg-base": role("surface"),
			"--dsw-alias-bg-layer-1": role("surface-container-low"),
			"--dsw-alias-bg-layer-2": role("surface-container"),
			"--dsw-alias-bg-layer-3": role("surface-container-high"),
			"--dsw-alias-bg-overlay": role("surface-container-high"),
			"--dsw-alias-bg-module-platform": role("surface-container-low"),
			"--dsw-alias-bg-multi-select": role("surface-container"),
			"--dsw-alias-bg-skeleton": role("skeleton"),
			"--dsw-alias-bg-mask-1": role("scrim"),
			"--dsw-alias-bg-mask-2": role("scrim-soft"),
			"--dsw-alias-bg-mask-3": role("scrim-strong"),
			"--dsw-alias-border-l1": role("border-faint"),
			"--dsw-alias-border-l2": role("border-soft"),
			"--dsw-alias-border-l3": role("outline-variant"),
			"--dsw-alias-border-l4": role("outline"),
			"--dsw-alias-brand-primary": role("primary"),
			"--dsw-alias-brand-text": role("primary"),
			"--dsw-alias-button-primary-fill": role("primary"),
			"--dsw-alias-button-primary-hover": role("primary-hover"),
			"--dsw-alias-button-primary-dimmed": role("primary-container"),
			"--dsw-alias-button-info-fill": role("primary"),
			"--dsw-alias-button-info-hover": role("primary-hover"),
			"--dsw-alias-button-contrast-fill": role("inverse-surface"),
			"--dsw-alias-button-elevated-fill": role("surface-container-low"),
			"--dsw-alias-button-floating-fill": role("surface-container-lowest"),
			"--dsw-alias-button-floating-hover": role("surface-container-low"),
			"--dsw-alias-button-ghost-active-fill": role("secondary-container"),
			"--dsw-alias-button-ghost-active-hover": role("secondary-container"),
			"--dsw-alias-button-ghost-active-border": role("outline"),
			"--dsw-alias-interactive-bg-hover": role("state-hover"),
			"--dsw-alias-interactive-bg-active": role("state-active"),
			"--dsw-alias-interactive-bg-hover-accent": role("state-hover-accent"),
			"--dsw-alias-interactive-bg-hover-solid": role("surface-container"),
			"--dsw-alias-label-primary": role("on-surface"),
			"--dsw-alias-label-primary-foreground": role("on-primary"),
			"--dsw-alias-label-primary-inverted": role("inverse-on-surface"),
			"--dsw-alias-label-primary-dimmed": role("on-surface-variant"),
			"--dsw-alias-label-secondary": role("on-surface-variant"),
			"--dsw-alias-label-tertiary": role("on-surface-variant"),
			"--dsw-alias-label-caption": role("outline"),
			"--dsw-alias-label-dimmed": role("outline-variant"),
			"--dsw-alias-menu-icon": role("on-surface-variant"),
			"--dsw-alias-link": role("primary"),
			"--dsw-alias-scrollbar-bg-l1": role("outline-variant"),
			"--dsw-alias-scrollbar-bg-l2": role("outline-variant"),
			"--dsw-alias-scrollbar-hover-l1": role("outline"),
			"--dsw-alias-scrollbar-hover-l2": role("outline"),
			"--dsw-alias-switch-thumb": role("surface-container-lowest"),
			"--dsw-alias-toast-bg": role("inverse-surface"),
			"--dsw-alias-toast-label": role("inverse-on-surface"),
			"--dsw-alias-tooltip-bg": role("inverse-surface"),
			"--dsw-alias-markdown-code-block": role("surface-container"),
			"--dsw-alias-markdown-code-block-banner": role("surface-container-high"),
			"--dsw-alias-markdown-code-segment-selected": role("surface-container-lowest"),
			"--dsw-alias-markdown-code-segment-unselected": role("surface-container"),
			"--dsw-alias-markdown-inline-code": role("surface-container-high"),
			"--dsw-alias-markdown-tag": role("secondary-container"),
			"--dsw-alias-markdown-citation": role("surface-container-high"),
			"--dsw-alias-markdown-placeholder": role("surface-container"),
			"--dsw-alias-state-business-primary": role("primary"),
			"--dsw-alias-state-business-tertiary": role("primary-container"),
			"--dsw-alias-state-error-primary": role("error"),
			"--dsw-alias-state-error-secondary": role("error-soft"),
			"--dsw-alias-state-success-primary": role("success"),
			"--dsw-alias-state-success-secondary": role("success-soft"),
			"--dsw-alias-state-success-tertiary": role("success-container"),
			"--dsw-alias-state-warn-primary": role("warn"),
			"--dsw-alias-state-warn-secondary": role("warn-soft"),
			"--dsw-alias-state-warn-tertiary": role("warn-container"),
			"--dsw-alias-state-warn-label": role("warn-label"),
			"--dsw-alias-state-idle-primary": role("outline-variant"),
			"--dsw-alias-state-done-primary": role("tertiary"),
			"--dsw-alias-turn-trigger-bg": role("surface-container"),
			"--dsw-alias-turn-trigger-bg-hover": role("surface-container-high"),
			"--dsw-specific-bubble": role("primary-container"),
			"--dsw-specific-bubble-highlight": role("tertiary-container"),
			"--dsw-specific-input-major": role("surface-container"),
			"--dsw-specific-login-input": role("surface-container-low"),
			"--dsw-specific-menu": role("menu-fill"),
			"--dsw-alias-menu-group-header-fill": role("menu-header-fill"),
			/* The popup surfaces (model picker, permission picker, slash and
			   context menus) paint through this pair, not through an alias:
			   a 70%-opaque fill plus a 40px blur. Both are retargeted so the
			   menus become flat M3 tonal containers instead of frosted glass. */
			"--dsw-menu-surface-fill": role("menu-fill"),
			"--dsw-menu-backdrop-filter": both("none"),
			"--dsw-specific-selector": role("surface-container-high"),
			"--dsw-specific-sidebar-fill": role("surface-container-low"),
			"--dsw-specific-sidebar-nav-item-active": role("secondary-container"),
			"--dsw-specific-sidebar-nav-item-active-accent": role("primary"),
			"--dsw-specific-tip": role("surface-container-high"),

			/* ── The tail of the host palette ────────────────────────────────
			   These names are painted by surfaces that only appear on demand:
			   the document preview, the photo viewer, code diffs, the empty-state
			   illustrations, onboarding. They were still resolving to the stock
			   bluish/blue/green scales, which is exactly where a theme that only
			   covers the visible chrome starts to look wrong. Tonal mixes are
			   written as `color-mix` over M3 roles so they follow the scheme. */
			"--dsw-alias-bg-document-preview": role("surface-container-low"),
			"--dsw-alias-label-document-preview": role("on-surface-variant"),
			"--dsw-alias-bg-document-selection": both(
				"color-mix(in srgb, var(--dsw-m3e-primary) 30%, transparent)"
			),
			/* Media scrims: a drop-target wash and the photo viewer's near-opaque
			   black, which is black by definition in both schemes. */
			"--dsw-alias-bg-mask-drop": both("color-mix(in srgb, var(--dsw-m3e-surface) 70%, transparent)"),
			"--dsw-alias-bg-mask-photo": both("color-mix(in srgb, #000000 88%, transparent)"),
			/* Toolbars that sit on top of media: inverse surface at three weights. */
			"--dsw-alias-border-inverted": pair(
				"transparent",
				"color-mix(in srgb, var(--dsw-m3e-inverse-on-surface) 8%, transparent)"
			),
			"--dsw-alias-border-inverted2": pair(
				"transparent",
				"color-mix(in srgb, var(--dsw-m3e-inverse-on-surface) 12%, transparent)"
			),
			"--dsw-alias-border-l2-darkmode-thin": role("border-soft"),
			"--dsw-alias-button-tool-bar-fill": both(
				"color-mix(in srgb, var(--dsw-m3e-inverse-surface) 50%, transparent)"
			),
			"--dsw-alias-button-tool-bar-fill-invisible": both(
				"color-mix(in srgb, var(--dsw-m3e-inverse-surface) 36%, transparent)"
			),
			"--dsw-alias-button-tool-bar-hover": both(
				"color-mix(in srgb, var(--dsw-m3e-inverse-surface) 60%, transparent)"
			),
			/* The brand pair: the stock "brand" is near-black, so the foreground
			   that sits on it has to become on-primary instead. */
			"--dsw-alias-brand-primary-invert": role("on-primary"),
			"--dsw-alias-brand-primary-new-colorprimary-new-color": role("primary"),
			/* Diffs: M3 has no diff palette, so success/error tonal containers
			   stand in — same information, in the theme's own hues. */
			"--dsw-alias-code-diff-added": both(
				"color-mix(in srgb, var(--dsw-m3e-success) 8%, transparent)"
			),
			"--dsw-alias-code-diff-deleted": both(
				"color-mix(in srgb, var(--dsw-m3e-error) 8%, transparent)"
			),
			"--dsw-alias-file-diff-added-bg": both(
				"color-mix(in srgb, var(--dsw-m3e-success) 12%, var(--dsw-m3e-surface))"
			),
			"--dsw-alias-file-diff-added-gutter": both(
				"color-mix(in srgb, var(--dsw-m3e-success) 6%, var(--dsw-m3e-surface))"
			),
			"--dsw-alias-file-diff-added-marker": role("success"),
			"--dsw-alias-file-diff-deleted-bg": both(
				"color-mix(in srgb, var(--dsw-m3e-error) 12%, var(--dsw-m3e-surface))"
			),
			"--dsw-alias-file-diff-deleted-gutter": both(
				"color-mix(in srgb, var(--dsw-m3e-error) 6%, var(--dsw-m3e-surface))"
			),
			"--dsw-alias-file-diff-deleted-marker": role("error"),
			/* Empty-state illustrations: a tonal stack, so the artwork sits on the
			   M3 surface ladder instead of the stock bluish greys. */
			"--dsw-alias-illustration-background": role("surface-container-low"),
			"--dsw-alias-illustration-backing": role("surface-container-high"),
			"--dsw-alias-illustration-detail": role("secondary-container"),
			"--dsw-alias-illustration-inset": role("primary"),
			"--dsw-alias-illustration-shadow": role("on-surface-variant"),
			"--dsw-alias-illustration-surface": role("surface-container-lowest"),
			"--dsw-alias-interactive-bg-hover-danger": both(
				"color-mix(in srgb, var(--dsw-m3e-error) 10%, transparent)"
			),
			/* "Deep diving" is the thinking label; it becomes the primary accent
			   and its shimmer a 30% cut of it, so the pulse stays on-theme. */
			"--dsw-alias-label-deep-diving": role("primary"),
			"--dsw-alias-label-deep-diving-shimmer": both(
				"color-mix(in srgb, var(--dsw-m3e-primary) 30%, transparent)"
			),
			"--dsw-alias-label-primary-bluish": role("on-surface"),
			"--dsw-alias-label-shimmer": both(
				"color-mix(in srgb, var(--dsw-m3e-on-surface) 30%, transparent)"
			),
			"--dsw-alias-onboarding-accent": role("primary"),
			"--dsw-alias-onboarding-card-fill": role("surface-container"),
			"--dsw-alias-onboarding-checkbox-border": role("outline"),
			"--dsw-alias-onboarding-secondary-fill": role("surface-container-high"),
			"--dsw-alias-settings-card-fill": role("surface-container"),
			"--dsw-alias-settings-card-stroke": role("border-soft"),
			"--dsw-alias-tooltip-key-bg": both(
				"color-mix(in srgb, var(--dsw-m3e-inverse-surface), var(--dsw-m3e-inverse-on-surface) 18%)"
			)
		};

		/**
		 * Shape, elevation and motion primitives, taken from the M3 design tokens
		 * (`md.sys.shape`, `md.sys.elevation`, `md.sys.motion` in material-web).
		 * The host stylesheets already read these custom properties, so expressive
		 * geometry and physics arrive without a single new class selector.
		 */
		const DESIGN = {
			/* md.sys.shape: 4 / 8 / 12 / 16 / 28, and the 28px window radius. */
			"--dsw-radius-xs": both("4px"),
			"--dsw-radius-sm": both("8px"),
			"--dsw-radius-md": both("12px"),
			"--dsw-radius-lg": both("16px"),
			"--dsw-radius-xl": both("28px"),
			"--dsw-radius-panel": both("28px"),
			/* md.sys.elevation levels 1 / 3 / 5: umbra + penumbra, as specified. */
			"--dsw-elevation-soft": both("0 1px 2px 0 #0000004d, 0 1px 3px 1px #00000026"),
			"--dsw-elevation-stroke": both("0 0 0 1px var(--dsw-alias-border-l2)"),
			"--dsw-elevation-panel": both("0 1px 3px 0 #0000004d, 0 4px 8px 3px #00000026"),
			"--dsw-elevation-prominent": both("0 4px 4px 0 #0000004d, 0 8px 12px 6px #00000026"),
			/* md.sys.elevation level 2 — the menu and popup layer. */
			"--dsw-m3e-elevation-2": both("0 1px 2px 0 #0000004d, 0 2px 6px 2px #00000026"),
			/* md.sys.motion: standard easing, short2 / short4 / medium2 durations. */
			"--ds-ease-in-out": both("cubic-bezier(0.2, 0, 0, 1)"),
			"--ds-transition-duration-fast": both("100ms"),
			"--ds-transition-duration": both("200ms"),
			"--ds-transition-duration-slow": both("300ms"),
			/* Focus rings and hairlines follow the expressive accent; 3px is
			   `md.sys.state.focus-indicator.thickness`, the host ships 2px. */
			"--dsw-focus-ring-color": both("var(--dsw-m3e-primary)"),
			"--dsw-focus-ring-width": both("3px")
		};

		/** Every token this plugin publishes, in one map. */
		const TOKENS = (() => {
			const tokens = {};
			for (const [name, value] of Object.entries(ROLES)) tokens[`--dsw-m3e-${name}`] = value;
			return Object.assign(tokens, ALIASES, DESIGN);
		})();

		/* ------------------------------------------------------------------ *
		 * Stylesheet: only what a custom property cannot express.
		 * Selectors prefer `data-*` hooks and CSS-module substring matches
		 * (`[class*="_card"]`) because module class names are hashed per build.
		 * ------------------------------------------------------------------ */
		const CSS = [
			"/* ── Material 3 Expressive ───────────────────────────────────────── */",
			":root { color-scheme: light dark; }",
			"",
			"/* Shape: M3E squircle geometry on the large containers. Chrome 139+;",
			"   older engines simply keep the border-radius. */",
			"[data-composer-card],",
			"[role=\"dialog\"],",
			"[class*=\"_card\"] { corner-shape: squircle; }",
			"",
			"/* Composer: the M3 filled text field — tonal container, tonal elevation. */",
			"[data-composer-card] {",
			"  background: var(--dsw-m3e-surface-container);",
			"  box-shadow: var(--dsw-elevation-panel);",
			"  transition: box-shadow var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, cubic-bezier(0.2, 0, 0, 1)),",
			"              background-color var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, cubic-bezier(0.2, 0, 0, 1));",
			"}",
			"[data-composer-card]:focus-within {",
			"  box-shadow: var(--dsw-elevation-prominent);",
			"}",
			"",
			"/* Send action: filled M3 button, on-colour text in both schemes (the",
			"   host hardcodes white there, which stops being legible on the tonal",
			"   dark-mode primary). */",
			"[data-composer-card] [class*=\"_primary\"] {",
			"  background: var(--dsw-m3e-primary);",
			"  color: var(--dsw-m3e-on-primary);",
			"}",
			"[data-composer-card] [class*=\"_primary\"]:hover:not(:disabled) {",
			"  background: var(--dsw-m3e-primary-hover);",
			"}",
			"",
			"/* Segmented/select controls become pills in the composer toolbar. */",
			"[data-composer-card] [class*=\"_select\"] { border-radius: 999px; }",
			"",
			"/* Motion: springy press feedback, M3 state layer painted above the",
			"   background and below the content. */",
			"@media (prefers-reduced-motion: no-preference) {",
			"  button,",
			"  [role=\"button\"] {",
			"    transition: transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1),",
			"                background-color 160ms var(--ds-ease-in-out, cubic-bezier(0.2, 0, 0, 1)),",
			"                box-shadow 160ms var(--ds-ease-in-out, cubic-bezier(0.2, 0, 0, 1));",
			"  }",
			"  button:active:not(:disabled),",
			"  [role=\"button\"]:active:not([aria-disabled=\"true\"]) {",
			"    transform: scale(0.94);",
			"  }",
			"}",
			"button:active:not(:disabled),",
			"[role=\"button\"]:active:not([aria-disabled=\"true\"]) {",
			"  box-shadow: inset 0 0 0 999px var(--dsw-alias-interactive-bg-active);",
			"}",
			"",
			"",
			"/* ── Surfaces: spatial entrance ──────────────────────────────────────",
			"   The host mounts dialogs as a hard cut, so the entrance is added here.",
			"   It grows out of the point that was pressed, the way a dialog does on a",
			"   phone, instead of popping open around its own centre.",
			"   Movement only, never opacity: fading a panel over its own scrim shows a",
			"   translucent copy of the panel for as long as the animation runs, and",
			"   fading a scrim that carries backdrop-filter smears the blur behind it.",
			"   Popups get no rule at all — the host re-mounts menu and list surfaces",
			"   on every list update, so an entrance animation there re-plays as a",
			"   flicker instead of appearing once. */",
			"@media (prefers-reduced-motion: no-preference) {",
			"  @keyframes m3e-spatial-in {",
			"    from { transform: scale(0.84); }",
			"    to { transform: none; }",
			"  }",
			"  [role=\"dialog\"][aria-modal=\"true\"] {",
			"    /* Stamped per dialog by the client half before the first frame: the",
			"       press point, converted into this box's own coordinates. Without",
			"       it the dialog grows from its centre, which still beats a hard cut. */",
			"    transform-origin: var(--m3e-origin-x, 50%) var(--m3e-origin-y, 50%);",
			"    animation: m3e-spatial-in 220ms cubic-bezier(0.05, 0.7, 0.1, 1) backwards;",
			"  }",
			"}",
			"",
			"/* Above the phone breakpoint the panel is a floating card, so it can settle",
			"   with a 0.4% overshoot; a full-screen panel would clip its own edge instead. */",
			"@media (prefers-reduced-motion: no-preference) and (min-width: 768px) {",
			"  @keyframes m3e-spatial-in-settle {",
			"    from { transform: scale(0.84); }",
			"    72% { transform: scale(1.004); }",
			"    to { transform: none; }",
			"  }",
			"  [role=\"dialog\"][aria-modal=\"true\"] { animation-name: m3e-spatial-in-settle; }",
			"}",
			"",
			"/* ── Popup surfaces: menus, pickers, context menus ──────────────────",
			"   The host draws these on a 70%-opaque layer with a 40px backdrop blur.",
			"   M3 menus are opaque tonal containers at level-2 elevation, so the fill",
			"   and the blur are retargeted through the host's own custom properties,",
			"   and the wrapper drops from level-5 to level-2 elevation.",
			"   Geometry and states come from md.comp.menus (M3E): 44px rows, 16px",
			"   side inset, 12px icon gap, 20px icons, label-large text, and a tonal",
			"   secondary-container fill for the selected row instead of a scrim. */",
			":has(> [data-menu-material]) { --dsw-elevation-prominent: var(--dsw-m3e-elevation-2); }",
			"[role=\"menu\"] [role=\"menuitem\"],",
			"[role=\"listbox\"] [role=\"option\"],",
			"[data-context-menu] [role=\"menuitem\"] {",
			"  min-height: 44px;",
			"  padding: 8px 16px;",
			"  gap: 12px;",
			"  font-size: 14px;",
			"  line-height: 20px;",
			"  font-weight: 500;",
			"  border-radius: var(--dsw-radius-md);",
			"}",
			"[role=\"menu\"] [role=\"menuitem\"] svg,",
			"[role=\"listbox\"] [role=\"option\"] svg,",
			"[data-context-menu] [role=\"menuitem\"] svg { width: 20px; height: 20px; }",
			"[role=\"menu\"] [role=\"separator\"],",
			"[data-context-menu] [role=\"separator\"] {",
			"  height: 1px;",
			"  margin: 4px 8px;",
			"  background: var(--dsw-m3e-outline-variant);",
			"}",
			"[role=\"menu\"] [role=\"menuitem\"][aria-checked=\"true\"],",
			"[role=\"menu\"] [role=\"menuitem\"][aria-current],",
			"[role=\"listbox\"] [role=\"option\"][aria-selected=\"true\"],",
			"[role=\"menu\"] [class*=\"_selectedFill\"] {",
			"  background: var(--dsw-m3e-secondary-container);",
			"  color: var(--dsw-m3e-on-secondary-container);",
			"}",
			"[role=\"menu\"] [role=\"menuitem\"][aria-checked=\"true\"] [class*=\"_itemIcon\"] {",
			"  color: inherit;",
			"}",
			"/* Tooltip: inverse surface, extra-small radius, label-medium text. The",
			"   host hardcodes white there, which vanishes on the light inverse",
			"   surface that dark mode uses, so the label colour is paired too. */",
			"[role=\"tooltip\"] {",
			"  border-radius: var(--dsw-radius-xs);",
			"  padding: 4px 8px;",
			"  font-size: 12px;",
			"  line-height: 16px;",
			"  color: var(--dsw-alias-label-primary-inverted);",
			"}",
			"",
			"/* Sidebar wash: the host paints a fixed blue/indigo gradient over the",
			"   sidebar column. Only the gradient layer is replaced — the host's own",
			"   background colour underneath is left alone — so the wash becomes the",
			"   M3 primary/tertiary pair instead of the stock brand hues. */",
			"[class*=\"_frame\"]:not([data-sidebar-drawer]) [class*=\"_sidebarCol\"] {",
			"  background-image: linear-gradient(to bottom,",
			"    color-mix(in srgb, var(--dsw-m3e-primary) 8%, transparent),",
			"    transparent 35%,",
			"    transparent 68%,",
			"    color-mix(in srgb, var(--dsw-m3e-tertiary) 8%, transparent));",
			"}",
			"",
			"/* ── Touch browsers ───────────────────────────────────────────────── */",
			"@media (pointer: coarse) {",
			"  *, *::before, *::after { -webkit-tap-highlight-color: transparent; }",
			"  :is(input, textarea, select):not([type=\"checkbox\"]):not([type=\"radio\"]) {",
			"    /* 16px keeps mobile Safari from zooming the viewport on focus. */",
			"    font-size: max(16px, 1em);",
			"  }",
			"  /* Comfortable hit areas: the composer's icon actions ship at 28-34px. */",
			"  [data-composer-card] [class*=\"_add\"],",
			"  [data-composer-card] [class*=\"_primary\"] { width: 36px; height: 36px; }",
			"  [data-composer-card] :is(button, select) { min-height: 36px; }",
			"  /* Menu rows grow to a 48px touch target. */",
			"  [role=\"menu\"] [role=\"menuitem\"],",
			"  [role=\"listbox\"] [role=\"option\"],",
			"  [data-context-menu] [role=\"menuitem\"] { min-height: 48px; }",
			"  /* No double-tap zoom delay, no landscape text inflation, no",
			"     pull-to-refresh fighting the chat scroller. */",
			"  html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }",
			"  html, body { overscroll-behavior-y: none; }",
			"  :is(button, [role=\"button\"], a, [role=\"tab\"]) { touch-action: manipulation; }",
			"}",
			"",
			"@media (max-width: 760px) {",
			"  /* Safe areas: no shipped stylesheet handles them. Additive margins only,",
			"     so stock spacing stays intact on devices without insets. */",
			"  [data-composer-seat] { margin-block-end: env(safe-area-inset-bottom); }",
			"  [data-shell-leading] { margin-inline-start: env(safe-area-inset-left); }",
			"  /* M3 navigation drawer: rounded trailing edge while it overlays content. */",
			"  [data-sidebar-drawer] {",
			"    border-start-end-radius: 28px;",
			"    border-end-end-radius: 28px;",
			"  }",
			"}",
			"",
			"/* Chat and list scrollers keep their own scroll chaining. */",
			"[class*=\"_scroll\"],",
			"[data-composer-seat] { overscroll-behavior: contain; }"
		].join("\n");

		/**
		 * Settings-row stylesheet: never removed while the plugin is loaded,
		 * because the row has to stay legible while M3 itself is switched off.
		 */
		const ROW_CSS = [
			".m3e-block { display: flex; flex-direction: column; gap: 8px; padding: 16px 0;",
			"  border-bottom: .5px solid var(--dsw-alias-border-l2); }",
			".m3e-block:last-child { border-bottom: none; }",
			".m3e-head { display: flex; align-items: center; justify-content: space-between; gap: 24px; }",
			".m3e-title { color: var(--dsw-alias-label-primary); font-size: 14px; font-weight: 400; line-height: 22px; }",
			".m3e-desc { color: var(--dsw-alias-label-secondary); margin-top: 4px; font-size: 12px; line-height: 18px; }",
			".m3e-cubes { display: flex; flex-wrap: wrap; gap: 8px; }",
			".m3e-cube { box-sizing: border-box; flex: 1 1 0; min-width: 96px; min-height: 48px; padding: 12px 8px;",
			"  border: .5px solid var(--dsw-alias-border-l4); border-radius: var(--dsw-radius-xl);",
			"  background: transparent; color: var(--dsw-alias-label-primary);",
			"  font: inherit; font-size: 14px; line-height: 22px; cursor: pointer; }",
			"@media (hover: hover) { .m3e-cube:hover:not([aria-pressed=\"true\"]) {",
			"  background: var(--dsw-alias-interactive-bg-hover); } }",
			".m3e-cube[aria-pressed=\"true\"] { background: var(--dsw-m3e-secondary-container, var(--dsw-alias-bg-module-platform));",
			"  border-color: transparent; color: var(--dsw-m3e-on-secondary-container, var(--dsw-alias-label-primary)); }",
			"/* Focus is ours to draw: these controls are plugin markup, so no host class",
			"   rule covers them. */",
			".m3e-cube:focus-visible, .m3e-switch:focus-visible {",
			"  outline: var(--dsw-focus-ring-width, 3px) solid var(--dsw-focus-ring-color, var(--dsw-m3e-primary, currentColor));",
			"  outline-offset: 2px; }",
			".m3e-switch { display: inline-flex; align-items: center; gap: 8px; flex: none; padding: 0;",
			"  border: none; background: transparent; color: var(--dsw-alias-label-secondary);",
			"  font: inherit; font-size: 12px; line-height: 18px; cursor: pointer; }",
			"/* M3 switch: outline-bordered container with an outline thumb when off,",
			"   primary container with an on-primary thumb when on. The off state used",
			"   to keep a white thumb on a light track, which is invisible in light mode. */",
			".m3e-track { position: relative; width: 44px; height: 26px; flex: none; border-radius: 999px;",
			"  box-shadow: inset 0 0 0 2px var(--dsw-m3e-outline, var(--dsw-alias-border-l4));",
			"  background: var(--dsw-m3e-surface-container-highest, var(--dsw-alias-bg-layer-3));",
			"  transition: background-color 160ms var(--ds-ease-in-out, ease), box-shadow 160ms var(--ds-ease-in-out, ease); }",
			".m3e-thumb { position: absolute; inset-block-start: 3px; inset-inline-start: 3px;",
			"  width: 20px; height: 20px; border-radius: 999px; background: var(--dsw-m3e-outline, var(--dsw-alias-border-l4));",
			"  transition: transform 160ms var(--ds-ease-in-out, ease), background-color 160ms var(--ds-ease-in-out, ease); }",
			".m3e-switch[aria-checked=\"true\"] .m3e-track {",
			"  background: var(--dsw-m3e-primary, var(--dsw-alias-brand-primary)); box-shadow: none; }",
			".m3e-switch[aria-checked=\"true\"] .m3e-thumb {",
			"  background: var(--dsw-m3e-on-primary, var(--dsw-alias-label-primary-foreground));",
			"  transform: translateX(18px); }",
			"@media (prefers-reduced-motion: reduce) { .m3e-track, .m3e-thumb { transition: none; } }"
		].join("\n");

		/** Append one `<style>` tag and return its remover. */
		const appendStyle = (part, css) => {
			const tag = document.createElement("style");
			tag.dataset.dshPlugin = PACKAGE_ID;
			tag.dataset.m3ePart = part;
			tag.textContent = css;
			document.head.append(tag);
			return () => {
				tag.remove();
			};
		};

		/* ── Spatial entrance: the dialog needs its press point before it paints ── */

		const DIALOG_SELECTOR = '[role="dialog"][aria-modal="true"]';
		const ORIGIN_X = "--m3e-origin-x";
		const ORIGIN_Y = "--m3e-origin-y";

		/**
		 * Stamp every newly mounted dialog with the press point, in its own
		 * coordinates, so the CSS entrance can grow out of that spot.
		 *
		 * The stamp cannot wait for an effect or a timer: the host inserts the
		 * dialog and the browser paints it in the same frame, so a late origin
		 * would snap the panel sideways mid-animation. A mutation observer
		 * callback runs after the insert and before that frame renders, which is
		 * the only slot early enough.
		 * @returns cleanup that unstamps and detaches the observer.
		 */
		const installSpatialOrigin = () => {
			// Nothing to observe yet in a host that has not mounted a body; the
			// entrance still runs, it just grows from the panel's centre.
			if (!document.body) return () => {};

			/** Last press position, page coordinates; null = centre the growth. */
			let press = null;

			const rememberPress = (event) => {
				if (typeof event.clientX !== "number" || typeof event.clientY !== "number") return;
				press = { x: event.clientX, y: event.clientY };
			};

			const stamp = (dialog) => {
				const rect = dialog.getBoundingClientRect();
				if (rect.width === 0 || rect.height === 0) return;
				const x = press === null ? rect.width / 2 : press.x - rect.left;
				const y = press === null ? rect.height / 2 : press.y - rect.top;
				// A press outside the panel still reads as "grew from there"; the
				// clamp only keeps the origin inside the box CSS can express.
				const cx = Math.min(Math.max(x, 0), rect.width);
				const cy = Math.min(Math.max(y, 0), rect.height);
				dialog.style.setProperty(ORIGIN_X, `${Math.round(cx)}px`);
				dialog.style.setProperty(ORIGIN_Y, `${Math.round(cy)}px`);
			};

			const scan = (node) => {
				if (!(node instanceof Element)) return;
				if (node.matches(DIALOG_SELECTOR)) stamp(node);
				for (const dialog of node.querySelectorAll(DIALOG_SELECTOR)) stamp(dialog);
			};

			const observer = new MutationObserver((records) => {
				for (const record of records) {
					for (const node of record.addedNodes) scan(node);
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });

			// Keyboard-opened dialogs have no press point; centre those.
			const forgetPress = (event) => {
				if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") press = null;
			};

			window.addEventListener("pointerdown", rememberPress, true);
			window.addEventListener("keydown", forgetPress, true);

			return () => {
				observer.disconnect();
				window.removeEventListener("pointerdown", rememberPress, true);
				window.removeEventListener("keydown", forgetPress, true);
				for (const dialog of document.querySelectorAll(DIALOG_SELECTOR)) {
					dialog.style.removeProperty(ORIGIN_X);
					dialog.style.removeProperty(ORIGIN_Y);
				}
			};
		};

		/* ── Theme layers: all three are reversible, all three are what "off" turns off ── */

		const layers = { tokens: null, styles: null, spatial: null };

		/**
		 * Publish the token layer and the expressive stylesheet.
		 * @param ctx - plugin context with `theme` injected.
		 */
		const enableTheme = (ctx) => {
			// The façade replaces this source string with the package id.
			layers.tokens ??= ctx.theme.overrideTokens(PACKAGE_ID, TOKENS);
			layers.styles ??= appendStyle("theme", CSS);
			layers.spatial ??= installSpatialOrigin();
		};

		/** Retract every layer, restoring the stock UI immediately. */
		const disableTheme = () => {
			layers.tokens?.();
			layers.styles?.();
			layers.spatial?.();
			layers.tokens = null;
			layers.styles = null;
			layers.spatial = null;
		};

		/* ── Row state: the appearance preference is the host's, the on/off
		      switch is ours and survives reloads in local storage ───────── */

		const PREF_KEY = "dsh-web-m3e.enabled";
		const listeners = new Set();
		let cached = null;

		const themeSnapshot = (ctx) => {
			if (cached === null) {
				try {
					cached = { value: ctx.theme.getTheme() };
				} catch {
					cached = { value: undefined };
				}
			}
			return cached.value;
		};

		const notify = () => {
			cached = null;
			for (const listener of listeners) listener();
		};

		const readEnabled = () => {
			try {
				return window.localStorage.getItem(PREF_KEY) !== "off";
			} catch {
				return true;
			}
		};

		const writeEnabled = (enabled) => {
			try {
				window.localStorage.setItem(PREF_KEY, enabled ? "on" : "off");
			} catch {
				// Private-mode storage denial: the switch still works for this page.
			}
		};

		/** Row copy follows the browser language; the host bundle ships both. */
		const copy = () => {
			const language = String((typeof navigator === "object" && navigator.language) || "").toLowerCase();
			return language.startsWith("zh")
				? {
					group: "Material 3 主题",
					groupHint: "明暗和系统「外观」设置共用同一个偏好。",
					modes: { light: "浅色", dark: "深色", system: "跟随系统" },
					title: "Material 3 配色",
					description: "关闭后立即恢复原生外观，明暗偏好保留。",
					on: "已启用",
					off: "已关闭"
				}
				: {
					group: "Material 3 theme",
					groupHint: "Light and dark share the preference of the system Appearance setting.",
					modes: { light: "Light", dark: "Dark", system: "System" },
					title: "Material 3 palette",
					description: "Turn off to restore the stock appearance; the light/dark preference is kept.",
					on: "On",
					off: "Off"
				};
		};

		/**
		 * Build the General-settings row: the light/dark/system cubes the host
		 * puts there, plus the switch that owns this plugin's two layers.
		 * @param ctx - plugin context with `theme` and `slots` injected.
		 * @returns the row component.
		 */
		const createRow = (ctx) => {
			const MODES = ["light", "dark", "system"];
			const Row = () => {
				const [, bump] = React.useState(0);
				React.useEffect(() => {
					const listener = () => bump((value) => value + 1);
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				}, []);
				const text = copy();
				const preference = themeSnapshot(ctx)?.preference ?? "system";
				const enabled = layers.tokens !== null;
				const toggle = () => {
					const next = !enabled;
					writeEnabled(next);
					if (next) enableTheme(ctx);
					else disableTheme();
					notify();
				};
				return React.createElement(
					"div",
					{ className: "m3e-group" },
					React.createElement(
						"div",
						{ className: "m3e-block" },
						React.createElement("div", { className: "m3e-title" }, text.group),
						React.createElement("div", { className: "m3e-desc" }, text.groupHint),
						React.createElement(
							"div",
							{ className: "m3e-cubes" },
							MODES.map((id) =>
								React.createElement(
									"button",
									{
										key: id,
										type: "button",
										className: "m3e-cube",
										"aria-pressed": preference === id,
										onClick: () => {
											ctx.theme.setTheme(id);
										}
									},
									text.modes[id]
								)
							)
						)
					),
					React.createElement(
						"div",
						{ className: "m3e-block" },
						React.createElement(
							"div",
							{ className: "m3e-head" },
							React.createElement(
								"div",
								null,
								React.createElement("div", { className: "m3e-title" }, text.title),
								React.createElement("div", { className: "m3e-desc" }, text.description)
							),
							React.createElement(
								"button",
								{
									type: "button",
									role: "switch",
									className: "m3e-switch",
									"aria-checked": enabled,
									onClick: toggle
								},
								React.createElement("span", null, enabled ? text.on : text.off),
								React.createElement(
									"span",
									{ className: "m3e-track", "aria-hidden": "true" },
									React.createElement("span", { className: "m3e-thumb" })
								)
							)
						)
					)
				);
			};
			return Row;
		};

		/**
		 * Plugin body: wire the theme-change stream, mount the row stylesheet,
		 * restore the persisted on/off state, then contribute the row.
		 * @param ctx - plugin context with `theme` and `slots` injected.
		 */
		const apply = (ctx) => {
			ctx.on("theme/change", notify);
			ctx.effect(() => appendStyle("row", ROW_CSS), `${PACKAGE_ID}: settings row styles`);
			ctx.effect(() => {
				if (readEnabled()) enableTheme(ctx);
				return () => {
					disableTheme();
				};
			}, `${PACKAGE_ID}: theme layers`);
			const Row = createRow(ctx);
			ctx.slots.inject("settings.general.item", () =>
				ctx.slots.register(
					{ name: "settings.general.item", id: "m3e-theme", order: 9 },
					Row
				)
			);
		};

		return { inject: ["theme", "slots"], apply };
	}
});
