/**
 * orderInfo.js — the explanatory copy every order page shows under its tabs.
 *
 * User request: "when I switch each order page, show at the top an info
 * introduction: how this order logic works, and which page's order it affects."
 *
 * So each entry answers, in plain language:
 *   • what this sequence controls
 *   • how the cards are GROUPED and numbered (the mental model)
 *   • every place on the public site where the order is visible
 *   • the traps (hidden cards, what is NOT affected, where the value is saved)
 *
 * Keyed by `<collection>:<orderKey>` so the artwork and image tabs can describe
 * the same order key differently (artist-page order means a different thing for
 * artworks than for images).
 */

const I = (en, cn) => ({ en, cn });

export const ORDER_INFO = Object.freeze({
  // ── IMAGES ────────────────────────────────────────────────────────────────
  "image:rolling_img_order": {
    title: I("Artist Page Order (Rolling Images)", "艺术家页排序（轮播图）"),
    tag: I("Artist list + artist page", "艺术家列表 + 艺术家页"),
    intro: I(
      "This decides WHICH images take part in the artist-side rolling slideshow, and in what order. If an artist has no separately-chosen “hover image”, this sequence is also what shows in the right-hand preview column of the /artists list while a name is hovered.",
      "这里决定参与“艺术家侧轮播”的图片有哪些、顺序如何。若某位艺术家没有单独选择“悬停图”，这条序列也会用于 /artists 列表右侧预览栏在悬停名称时的显示。"
    ),
    how: [
      I(
        "Cards are grouped by artist, A→Z. Every artist has ONE sequence: the numbers continue across that artist's source boxes (Works, Exhibition: …, Art Fair: …).",
        "卡片按艺术家分组（A→Z）。每位艺术家只有一条序列：编号会跨越该艺术家的来源分组（作品 / 展览：… / 艺博会：…）继续。"
      ),
      I(
        "Numbers are per artist and start at 1 — #1 is the first image this artist's slideshow shows.",
        "编号按艺术家从 1 开始 — 1 号就是这位艺术家轮播最先显示的图片。"
      ),
      I(
        "Drag inside a box to change the order. Dragging across boxes is not offered on purpose: the sequence belongs to the artist, not to a box.",
        "在同一分组内拖动即可改变顺序。不提供跨分组拖动：序列属于艺术家，而不是某个分组。"
      ),
      I(
        "The eye button removes an image from the rolling set: it keeps no position, greys out, drops to half size under the dashed line. Clicking it again puts the image back at the end of the sequence.",
        "点击眼睛按钮会把图片移出轮播集合：它将不再排序，变灰并缩到一半，放在虚线下。再次点击会把它放回序列末尾。"
      ),
    ],
    where: [
      I(
        "`/artists` (Artists list) → the preview column on the RIGHT. While a name is hovered this sequence rolls through the artist's images — UNLESS the artist has a chosen “hover image”, which wins (that is the next page).",
        "`/artists`（艺术家列表）→ 右侧预览栏。悬停名称时这条序列会轮播该艺术家的图片 — 除非该艺术家选了“悬停图”，悬停图优先（见下一个页面）。"
      ),
      I(
        "`/artists/<artist>` (artist DETAIL page, e.g. `/artists/chen_hongzhi`) → the rolling slideshow in the RIGHT column — used as the fallback until you save that artist's “Artist Detail Page Order”.",
        "`/artists/<artist>`（艺术家详情页，如 `/artists/chen_hongzhi`）→ 右栏的轮播图 — 在保存该艺术家的“艺术家详情页排序”之前作为回退使用。"
      ),
      I(
        "The image library API's default order, so any image list without its own order follows it.",
        "同一条序列也是图片库 API 的默认排序，因此没有独立排序的图片列表也按它显示。"
      ),
    ],
    notes: [
      I(
        "Saved on the image as `order.rolling_img_order`. Images without a number are appended after the numbered ones.",
        "保存在图片的 `order.rolling_img_order`。没有编号的图片会排在有序图片之后。"
      ),
      I(
        "Do not confuse the two rolling tabs: THIS one drives the artist LIST + is the detail page's fallback; “Artist Detail Page Order” drives the detail page's own slideshow.",
        "不要混淆两个轮播标签：本标签驱动“艺术家列表”并作为详情页回退；“艺术家详情页排序”驱动详情页自己的轮播。"
      ),
      I(
        "The picture shown when HOVERING an artist's name is a separate pick: Image → Artist Name Hover Image.",
        "悬停艺术家名称时显示的图片属于另一个页面：图库 → 艺术家名称悬停图。"
      ),
    ],
  },

  "image:artist_detail_rolling_img_order": {
    title: I(
      "Artist Detail Page Order (Rolling Images)",
      "艺术家详情页排序（轮播图）"
    ),
    tag: I("Artist detail page only", "仅艺术家详情页"),
    intro: I(
      "A SECOND, independent rolling sequence. It controls ONLY the artist DETAIL page — the page a visitor reaches by clicking a name (e.g. /artists/chen_hongzhi), NOT the /artists list. It is separate from “Artist Page Order” on purpose, so the two surfaces can roll different pictures. It only starts being used for an artist AFTER you save it for that artist.",
      "这是第二条独立的轮播序列，仅控制“艺术家详情页” — 访问者点击姓名后进入的页面（如 /artists/chen_hongzhi），不是 /artists 列表。它与“艺术家页排序”刻意分开，两个界面可以轮播不同图片。只有在为某位艺术家保存之后，该艺术家的详情页才会开始使用它。"
    ),
    how: [
      I(
        "Cards are grouped by artist, A→Z (same groups as the artist-page tab), with one numbered sequence per artist: 1…N.",
        "卡片按艺术家分组（A→Z，与艺术家页标签相同的分组），每位艺术家一条编号序列：1…N。"
      ),
      I(
        "Each artist's box STARTS with a preview strip of what that artist's detail page will show, in order — so you see the result before you save.",
        "每位艺术家的分组顶部会显示该艺术家详情页将会显示的内容预览（按顺序） — 在保存之前就能看到结果。"
      ),
      I(
        "Drag inside a box to change the order; the numbers follow the slides.",
        "在同一分组内拖动即可改变顺序；编号与轮播顺序一致。"
      ),
      I(
        "The eye button removes an image from THIS sequence only — it has its own hide flag, so the artist-page sequence is not affected (and the other way round).",
        "眼睛按钮只会把图片移出这条序列 — 它有自己的隐藏标记，不会影响艺术家页序列（反之亦然）。"
      ),
    ],
    where: [
      I(
        "`/artists/<artist>` (artist DETAIL page — the page you get by CLICKING a name) → the rolling slideshow in the RIGHT-hand column, at the top.",
        "`/artists/<artist>`（艺术家详情页 — 点击姓名后进入的页面）→ 右侧栏顶部的轮播图。"
      ),
      I(
        "NOT `/artists` (the name list) — that right-hand preview is a different surface (it uses the hover image, else “Artist Page Order”).",
        "不是 `/artists`（名称列表）— 那里右侧的预览是另一个界面（使用悬停图，否则用“艺术家页排序”）。"
      ),
    ],
    notes: [
      I(
        "Saved on the image as `order.artist_detail_rolling_img_order` (hide flag `artist_detail_rolling_image`).",
        "保存在图片的 `order.artist_detail_rolling_img_order`（隐藏标记 `artist_detail_rolling_image`）。"
      ),
      I(
        "Until you SAVE this order for an artist, that artist's detail page keeps using the Artist Page sequence — so the slideshow is never empty and nothing changes by accident. Each artist switches over on its own once its order is saved (the box says so until then).",
        "在未为某位艺术家保存这条排序之前，该艺术家的详情页仍使用“艺术家页”序列 — 因此轮播图不会为空，也不会被意外改动。每位艺术家在保存后会各自切换（未保存前分组内会提示）。"
      ),
      I(
        "See it in context: the shape of the DETAIL page is different from the list — name + bio on the left, this slideshow fixed on the right.",
        "实际位置：详情页与列表不同 — 左侧是姓名 + 简介，这个轮播固定在右侧。"
      ),
    ],
  },

  "image:exhibition_page_order": {
    title: I("Exhibition Page Order — Images", "展览页排序 — 图片"),
    tag: I("Exhibition pages", "展览页"),
    intro: I(
      "This is the order of the images inside each exhibition page's gallery. Images are grouped BY EXHIBITION (not by artist), because a show page shows one single ordered gallery: one show = one numbered sequence.",
      "这里决定每个展览页图集内图片的顺序。图片按展览分组（不是按艺术家），因为展览页只显示一条有序图集：一个展览 = 一条编号序列。"
    ),
    how: [
      I(
        "One box per exhibition that has images, in the same order as the Exhibitions list: newest first by start date, then by title.",
        "每个有图片的展览一个分组，顺序与展览列表一致：按开始日期从新到旧，其次按标题。"
      ),
      I(
        "A box contains exactly the images that exhibition's page displays: images whose tag (EN or CN) equals the exhibition title — the same rule the page itself uses.",
        "分组内只包含该展览页真正显示的那些图片：标签（中/英文）等于展览标题的图片 — 与页面使用的规则完全一致。"
      ),
      I(
        "Numbers run 1…N inside a box: #1 is the first image on that exhibition page, and it becomes the show's main image whenever the exhibition has no cover image of its own.",
        "分组内编号为 1…N：1 号是该展览页的第一张图片；当展览本身没有封面时，它也会成为该展览的主图。"
      ),
      I(
        "Drag to reorder inside a box. The order OF THE BOXES follows the exhibitions' own dates — change that in the exhibition manager, not here.",
        "在分组内拖动即可排序。分组之间的顺序由展览自身日期决定 — 请在展览管理页修改，而不是在这里。"
      ),
    ],
    where: [
      I(
        "Exhibition page (`/exhibitions/<show>`) → the installation-view gallery; image #1 is also the main image when no cover is set.",
        "展览页（`/exhibitions/<show>`）→ 现场图集；当没有设置封面时，第 1 张也会作为主图。"
      ),
    ],
    notes: [
      I(
        "Saved on the image as `order.exhibition_page_order`. The exhibition page tab also orders the ARTWORK list of the show — that one is Artwork → Order.",
        "保存在图片的 `order.exhibition_page_order`。展览页的作品列表由另一个页面排序：作品 → 排序。"
      ),
      I(
        "The eye button hides an image from that exhibition's page (same idea as hiding an artwork from the show's Works grid).",
        "眼睛按钮会把图片从该展览页隐藏（与从展览作品列表隐藏作品同理）。"
      ),
      I(
        "A trailing “Not matched” box holds images that still carry a position but whose exhibition can no longer be found (renamed show, re-tagged image …) — worth a check.",
        "末尾的“未匹配”分组列出仍保存了排序、但已找不到对应展览的图片（展览改名、图片标签改动等）— 值得检查。"
      ),
    ],
  },

  "image:art_fair_page_order": {
    title: I("Art Fair Page Order — Images", "艺博会页排序 — 图片"),
    tag: I("Art fair pages", "艺博会页"),
    intro: I(
      "This is the order of the images inside each art fair page's gallery. Like the exhibition tab, images are grouped BY ART FAIR: one fair = one numbered sequence.",
      "这里决定每个艺博会页图集内图片的顺序。与展览同理，图片按艺博会分组：一个艺博会 = 一条编号序列。"
    ),
    how: [
      I(
        "One box per art fair that has images, newest first by start date, then by title.",
        "每个有图片的艺博会一个分组，按开始日期从新到旧，其次按标题。"
      ),
      I(
        "A box contains exactly the images the fair page shows: tag (EN or CN) equal to the fair title, or an image that carries the fair's id.",
        "分组内只包含该艺博会页真正显示的图片：标签（中/英文）等于艺博会标题，或图片直接携带艺博会 id。"
      ),
      I(
        "Numbers run 1…N inside a box: #1 is the first image on that fair page.",
        "分组内编号为 1…N：1 号是该艺博会页的第一张图片。"
      ),
    ],
    where: [
      I(
        "Art fair page (`/fairs/<fair>`) → the gallery images.",
        "艺博会页（`/fairs/<fair>`）→ 图集。"
      ),
    ],
    notes: [
      I(
        "Saved on the image as `order.art_fair_page_order`.",
        "保存在图片的 `order.art_fair_page_order`。"
      ),
      I(
        "The eye button hides an image from that art fair's page.",
        "眼睛按钮会把图片从该艺博会页隐藏。"
      ),
    ],
  },

  // ── ARTWORKS ──────────────────────────────────────────────────────────────
  "artwork:artist_page_order": {
    title: I("Artist Page Order — Artworks", "艺术家页排序 — 作品"),
    tag: I("Artist page", "艺术家页"),
    intro: I(
      "This orders the WORKS on the artist page: the Related Artworks grid, the artist's work list and the thumbnail used in the artist list.",
      "这里决定艺术家页中作品的顺序：相关作品网格、该艺术家的作品列表，以及艺术家列表中的缩略图。"
    ),
    how: [
      I(
        "Cards are grouped by artist (A→Z, “Ungrouped” last); each artist is one independent sequence.",
        "卡片按艺术家分组（A→Z，“未分组”在最后）；每位艺术家是一条独立序列。"
      ),
      I(
        "Numbers run 1…N inside a group — #1 is the first work on that artist's page. Works without a number follow, newest year first.",
        "分组内编号 1…N — 1 号是该艺术家页上的第一件作品。没有编号的作品排在其后，年份新的优先。"
      ),
      I(
        "The eye button hides a work from the artist page only: it keeps no position here, greys out and drops under the dashed line. Its positions on the exhibition / art fair pages are untouched.",
        "眼睛按钮只会把作品从艺术家页隐藏：它在这里不再排序、变灰并放到虚线下。它在展览页 / 艺博会页的排序不受影响。"
      ),
    ],
    where: [
      I("Artist page (`/artists/<artist>`) → “Related Artworks” grid and the work list.", "艺术家页（`/artists/<artist>`）→“相关作品”网格与作品列表。"),
      I("Artist list (`/artists`) → each artist's thumbnail.", "艺术家列表（`/artists`）→ 每位艺术家的缩略图。"),
    ],
    notes: [
      I(
        "Saved on the artwork as `order.artist_page_order`. This does NOT order the artist page's image slideshow — that is Image → Order.",
        "保存在作品的 `order.artist_page_order`。它并不决定艺术家页的图片轮播 — 那是 图库 → 排序。"
      ),
    ],
  },

  "artwork:exhibition_page_order": {
    title: I("Exhibition Page Order — Artworks", "展览页排序 — 作品"),
    tag: I("Exhibition pages", "展览页"),
    intro: I(
      "This orders the WORKS inside an exhibition page's “Works” grid. Works are grouped by artist; the positions are per exhibition page, so the same work can sit at #1 on one show and #5 on another.",
      "这里决定展览页“作品”网格中作品的顺序。作品按艺术家分组；排序按展览页独立保存，因此同一件作品可以在不同展览中处于不同位置。"
    ),
    how: [
      I(
        "Cards are grouped by artist (A→Z); numbers run 1…N inside each artist's group.",
        "卡片按艺术家分组（A→Z）；组内编号 1…N。"
      ),
      I(
        "An exhibition only lists the works pinned to it (from the exhibition's related artworks, or the artwork's related exhibitions).",
        "展览只列出关联到它的作品（来自展览的关联作品，或作品的关联展览）。"
      ),
      I(
        "The eye button hides a work from the exhibition page; other pages keep their own positions.",
        "眼睛按钮把作品从展览页隐藏；其他页面各自的排序保持不变。"
      ),
    ],
    where: [
      I("Exhibition page (`/exhibitions/<show>`) → the “Works” grid.", "展览页（`/exhibitions/<show>`）→“作品”网格。"),
    ],
    notes: [
      I(
        "Saved on the artwork as `order.exhibition_page_order`. The show's image gallery is ordered separately (Image → Order → Exhibition Page Order).",
        "保存在作品的 `order.exhibition_page_order`。展览的图片图集另行排序（图库 → 排序 → 展览页排序）。"
      ),
    ],
  },

  "artwork:art_fair_page_order": {
    title: I("Art Fair Page Order — Artworks", "艺博会页排序 — 作品"),
    tag: I("Art fair pages", "艺博会页"),
    intro: I(
      "This orders the WORKS inside an art fair page's “Works” grid, grouped by artist, with one position per fair.",
      "这里决定艺博会页“作品”网格中作品的顺序，按艺术家分组，每个艺博会有独立位置。"
    ),
    how: [
      I("Cards are grouped by artist (A→Z); numbers run 1…N inside each group.", "卡片按艺术家分组（A→Z）；组内编号 1…N。"),
      I("The eye button hides a work from the art fair page only.", "眼睛按钮只会把作品从艺博会页隐藏。"),
    ],
    where: [I("Art fair page (`/fairs/<fair>`) → the “Works” grid.", "艺博会页（`/fairs/<fair>`）→“作品”网格。")],
    notes: [
      I("Saved on the artwork as `order.art_fair_page_order`.", "保存在作品的 `order.art_fair_page_order`。"),
    ],
  },

  // ── Image hover page (a picker, not an order) ──────────────────────────────
  "image:artist_hover_image": {
    title: I("Artist Name Hover Image", "艺术家名称悬停图"),
    tag: I("Artist names", "艺术家名称"),
    intro: I(
      "ONE image per artist: the picture a visitor sees when they hover the artist's NAME. It is a single pick (a flag), not an order — the rolling sequences are untouched by it.",
      "每位艺术家一张图片：访客悬停艺术家“名称”时看到的图片。它是一次单选（标记），不是排序 — 不会改变任何轮播序列。"
    ),
    how: [
      I(
        "Cards are grouped by artist, A→Z (one box per artist). Everything is grey until it is picked; the picked image turns to full colour and jumps to the front of its group.",
        "卡片按艺术家分组（A→Z，每位艺术家一个分组）。未被选中的都是灰色；被选中的图片恢复颜色并移到该组最前。"
      ),
      I(
        "Only ONE per artist. Choosing another image for the same artist clears the previous choice automatically.",
        "每位艺术家只保留一张。为同一艺术家选择另一张时，会自动取消上一张。"
      ),
      I(
        "If an artist somehow has more than one (older data / import), a red banner appears at the top — click “Keep the first, clear the rest” to fix every artist at once.",
        "若某位艺术家意外拥有多张（旧数据 / 导入），页面顶部会出现红色提示 — 点击“保留第一张，清除其余”可一次修好所有艺术家。"
      ),
      I(
        "Clicking the button saves immediately; there is no separate save step.",
        "点击按钮即保存，无需额外保存步骤。"
      ),
    ],
    where: [
      I(
        "`/artists` (Artists list) → the preview column on the RIGHT: hovering the artist's NAME shows this exact image (it overrides the rolling preview while hovered).",
        "`/artists`（艺术家列表）→ 右侧预览栏：悬停艺术家“名称”时显示的就是这张图片（悬停期间它优先于轮播预览）。"
      ),
      I(
        "`/artists/<artist>` (artist detail page) → the rolling slideshow; hovering the slideshow reveals this image (it also leads the slideshow).",
        "`/artists/<artist>`（艺术家详情页）→ 轮播图；悬停轮播图会显示这张图片（它也会作为轮播的第一张）。"
      ),
      I(
        "Artist names shown elsewhere on the site (menus / lists) → the same hover preview.",
        "网站其他位置的艺术家名称（菜单 / 列表）→ 同样的悬停预览。"
      ),
    ],
    notes: [
      I(
        "Saved on the image as the `artist_hover_image` flag inside `mark`.",
        "保存在图片的 `mark.artist_hover_image` 标记中。"
      ),
      I(
        "If an artist has NO hover image, the /artists preview falls back to the rolling sequence (Image → Artist Page Order), then to the artist's latest work.",
        "若某位艺术家未设置悬停图，/artists 预览会回退到轮播序列（图库 → 艺术家页排序），再回退到该艺术家的最新作品。"
      ),
    ],
  },
});

/** Info entry for one order key on one collection (null when unwritten). */
export const orderInfoFor = (orderKey, entity = "image") =>
  ORDER_INFO[`${entity}:${orderKey}`] || null;

export default orderInfoFor;
