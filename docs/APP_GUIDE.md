# Hu Jieming — App Guide

What this codebase actually is, how it is wired, and the rules that keep it
consistent. Everything below was checked against the code in this repo; if a
statement here disagrees with the code, the code wins — fix the doc.

> Stack: Next.js 15 (App Router) · React 18 · MUI 5 + Tailwind 3 ·
> framer-motion · next-themes · React Query · MongoDB (official driver) ·
> Prisma client (batch-edit routes only, see §4).

---

## 1. What this app is

A single-artist site for **胡介明 / Hu Jieming** — artworks, exhibitions, news,
CV, about, contact — plus an in-app **manager** (CRUD, ordering, image sync,
CSV export, site settings, form settings) behind a pattern lock.

Public site and manager are the **same Next.js app**. The manager is `/manager/*`
with its own drawer navigation and auth gate.

---

## 2. Routes

### Public

| Route | Component | Notes |
| --- | --- | --- |
| `/` | `pages/home/HomePage` | Sectioned home (artworks scroller, recent works, exhibitions, bibliography). Not a redirect. |
| `/artworks` | `pages/artworks/ArtworkPageComponent` | Works list; language-filtered; year desc. |
| `/artworks/[slug]` | `pages/artworks/ArtworkDetailPageComponent` | Single work; self-fetching. |
| `/archive` | `pages/archive/ArchivePageComponent` | Year-grouped archive, list/grid views. |
| `/artworks/archive` | — | Legacy URL; 307 → `/archive`. |
| `/exhibitions` | `pages/exhibition/ExhibitionPageComponent` | List. |
| `/exhibitions/[slug]` | exhibition detail | Current / past from dates. |
| `/news` | `pages/news/NewsPageComponent` | News & press; detail at `/news/[slug]`. |
| `/resume` | `pages/resume/ResumePageComponent` | CV grouped by `type`. |
| `/about` | `pages/about/AboutPageComponent` | Biography + portrait. |
| `/contact` | `pages/contact/ContactPageComponent` | Artist contact. |

### Manager (`/manager/*`)

`/manager` itself **redirects to `/manager/artwork`** — there is no dashboard.

Content collections (each has the same shape: list, `create`, `[id]`,
`[id]/edit`, `batch_edit`, and `reorder`/`order` where ordering applies):

```
about · artist-contact · artwork · bibliography · enquire · event ·
exhibition · image · resume · series · video · web · writing · subscribe
```

Singular pages:

| Route | Purpose |
| --- | --- |
| `/manager/meta` | Site Meta editor (nav menus, footer, SEO, `formTypes`). |
| `/manager/form-settings` | Show/hide/reorder each form's sections and fields. |
| `/manager/subscribe` | Subscribers (read / delete only; no create form). |
| `/manager/artwork/order` | Page-specific artwork ordering (artist / exhibition). |
| `/manager/image/order`, `/manager/image/hover` | Rolling images, hover images. |
| `/manager/<collection>/reorder` | Drag-and-drop list order (where enabled). |

Navigation is the **left drawer** (`ManagerSideNav`), built from
`Meta.menu.managerMenu` via `lib/managerMenu.js`; settings pages are injected at
read time. Layout: `About` and `Contact` as plain links, then `Content`, `Media` and
`Settings` as accordions (chevron, no frame, a vertical rule guides the child
items; all open by default, Settings last in the list). `ManagerNav.jsx` is the older centred nav and is not
mounted.

---

## 3. App shell

```
src/app/layout.jsx              providers only
└─ LayoutContent                the whole shell (one file, on purpose)
   ├─ QueryClientProvider
   ├─ ManagerAuthGate           manager only: PatternLock until authenticated
   ├─ MainNav | ManagerSideNav  public nav row | manager drawer + language switcher
   ├─ BackButton                detail pages only
   ├─ <main>{children}</main>
   ├─ WritingSidePanel          public writing drawer
   └─ Footer                    incl. light/dark toggle
```

* **Loading gate.** `LayoutContent` keeps the shell hidden and shows
  `LoadingAnimation` until: layout delay (`LAYOUT_LOADING_TIME`) + route settle +
  every `useData` request finished (`utils/pageLoadState.js`) + `window.load`
  (12 s cap). Nav labels never flash before data arrives.
* **Back button.** Rendered when the path has ≥2 segments, except `/`,
  manager routes and `/archive` (that page renders its own control).
* **Theme toggle** lives only in the footer (`buttons/ThemeToggleButton`).

---

## 4. Data layer

Two access paths, one MongoDB database:

1. **API routes** `src/app/api/<entity>/…`, generated from a per-entity contract
   in `src/app/api/_config/<entity>_api_config.js`. The app (public pages and
   manager alike) reads through these, via `useData` / React Query.
2. **Prisma** — `@prisma/client` is used by the few `*/batch_edit/route.js`
   handlers and `components/forms/utils/formFieldsUtils.js`.
   `prisma/schema.prisma` documents the collections; `_lib/prisma_relations.js`
   is legacy and currently has no importers.

### API shells

| File | Role |
| --- | --- |
| `_lib/api_shell.js` | List (GET), create (POST), update (PUT), delete (DELETE). |
| `_lib/api_id_shell.js` | One document by id. |
| `_lib/batch_api_shell.js` | Batch update used by `batch_edit` pages. |
| `_lib/mongo.js` | Client / collection access. |
| `_lib/list_cache.js` | Short-lived list cache (`X-List-Cache: HIT/MISS`), cleared on writes. |

### Per-entity config

```js
{
  collectionName,
  validFields,        // allow-list; anything else is stripped on write
  searchableFields, arrayFields, jsonFields,
  defaultSortField, defaultSortOrder,
  beforeCreate, beforeUpdate, transformResponse,   // hooks
}
```

`transformResponse` gets the whole array on list endpoints, one object on the id
endpoint — handle both.

### Prisma rules

* `prisma/schema.prisma` mirrors the collections. Several models carry **legacy
  multi-artist fields** (e.g. `order.art_fair_page_order`) that this single-artist
  site does not use; do not assume a field implies a feature.
* **Never run `prisma db push` / migrations against the shared cluster.** The
  only safe command is `npx prisma generate` (also part of `npm run build`).

---

## 5. Site Meta (single source of site settings)

One `Meta` document (`/api/meta`), edited at `/manager/meta`:

* footer copy, **menus** (`menu.mainMenu` / `menu.managerMenu`, `{ en, cn }` with
  optional `dropdown`), SEO tags, and **`formTypes`** (per-entity `type` options).
* Read with `useSiteMeta()` (client) or `/api/meta` (server).
* Defaults when the doc/DB is unavailable: `src/data/site_meta/*.json`
  (`app_info`, `footer`, `menus`) + `src/data/forms/form_type.json`, assembled in
  `src/utils/siteMetaDefaults.js`.
* **The Meta doc wins over JSON defaults** — change nav via the doc (the manager
  does `PUT /api/meta`), not by editing JSON alone.

`formTypes` keys shipped in `form_type.json`:
`artwork · image · video · event · about · mark · web · language · writing`.
Seeded fallbacks: `exhibition ← event`, `series ← artwork`, `resume ← about`,
`bibliography ← writing`. There is **no art-fair list and no fair collection** —
the site has no fairs section.

---

## 6. Theming

* `next-themes`, `attribute="class"`, `storageKey="theme"`, default light.
* `useReverseTheme()` → `{ isDark, colors }`; also publishes CSS variables
  (`--text-primary`, `--background-primary`, `--border-light`,
  `--interactive-background-hover`, `--drawer-bg`).
* **Never hard-code black/white for chrome.** Use the CSS vars, `colors` from
  `useReverseTheme()`, or Tailwind `dark:` variants. Semantic colours are exempt.
* Fonts: always `useFont(role)` (`lib/typography.js`).

---

## 7. Language (EN / 中文)

* `LanguageContext` → `{ isCn, toggleLanguage }`; all UI branches on `isCn`.
* `LanguageSwitcherInMenu` shows *the other* language; it sits in the public nav
  and in the manager drawer.
* **Never hand-write `"English / 中文"`.** Two supported shapes:
  * `{ en, cn }` objects → `pickText` / `resolveLocalizedLabel`;
  * registry entries → `bilingual(pair)` from
    `src/components/labels/managerLabels.js`, which returns the same combined
    string and keeps every label in one place.
* Form language follows the UI language: `FormShell` re-seeds the form's
  `language` on an `isCn` change (manual override still allowed).
* **Data** is language-filtered with `utils/filterByLanguage(items, isCn)`.
  Collections store one row per language; unfiltered lists show both copies.

---

## 8. The manager

### Lists

Every list page is a thin wrapper:

```jsx
<EditorialManagerList config={artworkManagerConfig} />
```

The config lives in `src/components/pages/manager/config/collections/<name>ManagerConfig.js`
(no schema configs any more). It declares fields, filter fields, filters, routes,
API paths, grouping, row/card rendering, extra links and header actions.
See `config/collections/README.md` for the file→page map and the read order.

`EditorialManagerList` provides: cards/list toggle, group-by options
(year / A–Z / type / none), search, filters, batch-edit and export links, order
links, delete, language filtering, and the guide drawer.

Batch-edit grouping is separate: `config/schemaBatchGroupConfig.js`.

### Forms

* `forms/managers/TabbedFormManager.jsx` — tabs, header row (`表单设置` /
  language selector / save), validation.
* `forms/shells/FormShell.jsx` — loads the record, syncs language, remounts on
  language switch.
* `forms/settings/resolveFormSchema.js` — merges the entity schema with the
  per-form visibility settings stored by `/manager/form-settings`.
* Labels come from `src/components/labels/*.js`; forms never inline bilingual
  strings.

### Guide

`components/docs/ManagerUserGuide.jsx` renders
`src/data/manager_user_guide_doc.json` in a right-edge panel. Keep that JSON in
sync with the app: if a section describes a page or field that no longer exists,
delete the section.

---

## 9. Cover field rule

The canonical artwork cover field is **`cover_image_url`** — what the DB rows,
public pages and `prisma/schema.prisma` use.

Older manager code still asks for `cover_img_url`.
`src/app/api/_config/artwork_api_config.js` bridges them:

* **read** mirrors both ways so every consumer finds the image;
* **write** stores only `cover_image_url`.

Other collections (exhibition, event, writing, series, bibliography) use
`cover_img_url` themselves; apply the same alias if their data ever lands under
`cover_image_url`.

---

## 10. Commands & gotchas

```bash
npm run dev            # next dev (default :3000)
npm run build          # npx prisma generate && next build
npx prisma generate    # the only safe Prisma command
```

**Dev cache corruption.** `.next` occasionally corrupts and pages 500 with
`Cannot find module './vendor-chunks/*.js'`:

```bash
lsof -ti:3000 | xargs kill -9
rm -rf .next && npm run dev
```

**Headless screenshots** of animated screens can be blank because the intro
animation does not run under Chrome's virtual time — a screenshot artefact, not
a bug.

**Do not touch customer/production data.** The Mongo cluster is shared; only
this app's collections and `Meta` document are in scope, through this app's API.

---

## 11. Directory map

```
src/
  app/                    routes (public + manager) and /api/*
    api/_config/          one contract per entity
    api/_lib/             api shells, mongo, list cache, batch shell
  components/
    docs/                 ManagerUserGuide (guide drawer)
    forms/                forms per entity, managers/, shells/, settings/, labels/
    labels/               every bilingual label (single registry)
    layouts/              LayoutContent (whole shell), page layouts
    navs/                 MainNav · ManagerSideNav (drawer)
    pages/
      manager/
        config/collections/   one config per manager list page
        config/schemaBatchGroupConfig.js
        layouts/EditorialManagerList.jsx
        components/, utils/
  data/                   site_meta/*.json, forms/form_type.json, guide JSON
  hooks/                  useSiteMeta, useReverseTheme, useFont, useData, …
  lib/                    typography, managerMenu, mainMenu, siteMetaServer
  schemas/                zod schemas (server-side validation)
  utils/                  filterByLanguage, bilingualUtils, mediaOrder, …
prisma/schema.prisma      model reference (not the write path)
```
