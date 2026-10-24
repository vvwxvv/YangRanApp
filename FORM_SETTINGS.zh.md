# 表单设置（Form Settings）

决定后台表单**显示哪些字段**，以及每个编辑者如何再精简自己的视图。

> 适用于所有带 tab 的新建/编辑表单（artwork、exhibition、event、writing、
> bibliography、series、resume、image、video、web、about、artist-contact、
> enquire）。手写字段的表单（如 user 表单）不在此范围。
> 英文版：[`docs/FORM_SETTINGS.md`](./docs/FORM_SETTINGS.md)

---

## 1. 三层结构

| 层 | 存在哪 | 谁改 | 控制 |
| --- | --- | --- | --- |
| 代码 schema | `sections/<Entity>FormSection.jsx` | 开发者 | 字段类型、组件、默认顺序 |
| 站点设置 | Mongo `FormSetting`（Prisma 同名 model） | 管理员 | 显示 / 必填 / 核心 / 顺序 / 改名 / 换区块 |
| 个人偏好 | `localStorage` → `formprefs:v1:<formKey>` | 每个编辑者 | 自己用不到的字段 |

`resolveFormSchema()` 是纯函数，按上面的顺序合并，返回
`{ schema, fields, stats, layout }`。

**隐藏不删数据**：字段只是不再渲染，已存的值保留。区块内字段全被隐藏时，
整个 tab 会消失，不留空 tab。

`showAll`（个人页签里的「显示全部」）只临时显示**自己**隐藏的字段，
不会显示管理员隐藏的字段。

---

## 2. 数据模型

```prisma
model FormSetting {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  formKey    String   @unique
  layout     Json?    // { progressive: true }
  sections   Json?    // { details: { visible: false } }
  fields     Json?    // { title: { required: true }, credits: { visible: false } }
  discovered Json?    // 表单首次挂载时自报的 schema 快照
  updatedAt  DateTime @updatedAt
}
```

`sections` / `fields` 是**按名字索引的对象**，改一个开关只 `$set` 一个键，
两个人改不同字段不会互相覆盖。

运行时用 `mongodb` driver（和本项目其它路由一致），不用 `PrismaClient`。
集合在第一次写入时自动创建，**不需要 `prisma db push`**，也不对共享集群做迁移。

客户端可写字段：`visible`、`required`、`essential`（核心）、`order`、
`label {en,cn}`、`section`；其余由 `cleanFieldSetting()` 丢弃。
区块可写：`visible`、`collapsed`、`order`、`label`。

---

## 3. 在哪里改

### 表单内（主入口）

tab 上方右侧的 **`Form settings`** 按钮（粗体黑字，hover 时下划线从左展开）打开右侧抽屉，
三个页签：

| 页签 | 作用范围 | 写入 |
| --- | --- | --- |
| **Everyone / 全局** | 全站 | `PUT /api/form-settings` |
| **Only me / 仅自己** | 当前浏览器 | `localStorage` |
| **Type options / 类型选项** | 当前表单的 `type` 下拉 | `PUT /api/meta`（`meta.formTypes[formKey]`） |

- **Everyone**：每个字段一行 `显示` / `必填`，每个区块一个开关。
  隐藏区块会清掉其字段的必填标记（隐藏 + 必填 = 表单永远提交不了）。
- **Only me**：必填字段不可隐藏。
- **Type options**：从 Site Meta 搬过来的。作品类型属于作品表单，不属于站点全局设置。
  数据结构（`{ label_en, label_cn }`）没变，旧值继续有效。

### 一次性看全部

`/manager/form-settings` 列出所有已注册的表单，字段开关与上面一致，另有
`Essential first` 布局开关。

导航项由 `withSystemManagerEntries()`（`src/lib/menu.js`）在**读取时注入**，
所以更早保存的菜单文档也盖不住它。

---

## 4. 表单如何注册

`TabbedFormManager` 首次挂载时把 sections/fields 快照 POST 给
`POST /api/form-settings`（同一签名只发一次）。因此：

- 不需要维护硬编码的表单/字段清单；
- 表单打开一次就会出现在设置页；
- 以后新增字段，下次打开表单自动出现；
- 设置里引用了已删除的字段也不会报错（resolver 以代码 schema 为准遍历）。

---

## 5. 必填怎么生效

各实体 zod schema 所有字段都是 `.optional()`（兼容历史数据）。必填在运行时叠加：

```js
const effective = applyRequired(schema, requiredFieldNames); // superRefine
const form = useForm({ resolver: zodResolver(effective), … });
```

`useForm` 只在初始化时读一次 resolver，而设置是异步加载的。
`useLiveZodResolver()` 在 effective schema 变化时替换
`form.control._options.resolver`，这样新加的必填项才会真正校验，且不重挂表单、不丢输入。

两个不变量：

1. **隐藏的字段不能是必填**，否则表单永远提交不了；隐藏区块时自动清掉。
2. **`useFieldArray` 必须按代码 schema 注册，不能按 resolved schema**，
   否则隐藏区块导致 hook 数量变化，React 直接抛错。

`FormShell` 挂载时会校验一次，所以新建表单打开就能看到必填红线。
嫌太激进就把 `mode` 改成 `"onTouched"`。

---

## 6. 抽屉的样式坑

两个抽屉（`Form settings`，以及从 `/manager` 打开的 `Site Meta`）都依赖：

```jsx
<Drawer
  placement="right"
  mask={false}                                  // 不要灰色遮罩
  zIndex={3000}                                 // 高于管理导航
  rootStyle={{ background: 'transparent' }}     // 见下
/>
```

- `mask={false}`：打开抽屉时页面保持原样。
- 透明根节点**必须加**：`globals.css` 里有 `div { background-color: var(--background-primary) }`，
  抽屉根节点是全屏 div，会被刷成不透明白色，把整页盖住。
- 默认 `zIndex` 是 1000，低于管理导航，会把抽屉标题和页签压住。
- `globals.css` 还有 `button { color: … !important }`，黑底白字会变成黑底黑字，
  所以按钮用描边样式（主题背景 + 主题描边），不要 `background:#000; color:#fff`。

---

## 7. API

| 方法 | 路径 | Body | 用途 |
| --- | --- | --- | --- |
| GET | `/api/form-settings` | — | `{ data: { [formKey]: doc } }` |
| PUT | `/api/form-settings` | `{ formKey, layout?, sections?, fields? }` | 保存单个表单 |
| POST | `/api/form-settings` | `{ formKey, sections }` | 表单注册自己 |
| DELETE | `/api/form-settings?formKey=` | — | 恢复代码默认 |

**鉴权**：后台是前端 pattern lock，API 层本来没有会话概念（和本项目其它
`/api/*` 一致）。请求带 token（`authToken` cookie 或 `Bearer`）时会校验，
没带就放行。以后接真登录，把 `route.js` 里的 `authorize()` 换成共享守卫即可。

---

## 8. 文件

```
src/lib/formSettingsServer.js                     服务端读写（Mongo）
src/app/api/form-settings/route.js                GET/PUT/POST/DELETE
src/app/manager/form-settings/page.jsx            全部表单页
src/components/forms/settings/
  resolveFormSchema.js                            三层合并（纯函数）
  FormSettingsContext.jsx                         Provider、缓存、个人偏好
  FieldsCustomizeMenu.jsx                         触发按钮 + 抽屉
  FormTypeOptionsPanel.jsx                        type 下拉编辑器（按表单）
  applyRequired.js                                zod superRefine
  useLiveZodResolver.js                           resolver 热替换
  formKey.js                                      config/apiRoute → formKey
src/components/forms/shells/{FormShell,EditFormShell}.jsx
src/components/forms/managers/TabbedFormManager.jsx
```

---

## 9. 开发注意

- **同一项目只能有一个 dev server**。两个 `next dev` 共用 `.next`，会互相覆盖
  manifest，浏览器报 `[object Event]` / `ChunkLoadError`，或一直卡在 “Loading…”。
  `scripts/dev-guard.mjs` 作为 `predev` 运行，启动前会杀掉本目录的其它 dev server。
- **dev 运行时不要跑 `next build`**，它会把 `.next` 整个重写，结果一样。先停服再 build。
- 无头浏览器验证：pattern lock 只查 `localStorage`，预置会话键后可直接访问 `/manager/*`。

---

## 10. 暂未实现

- 区块/字段拖拽排序（模型有 `order`，UI 没开）。
- 条件字段（如 `type = video` 才显示 `duration`）——resolver 预留了位置，
  但要接 `form.watch()`，注意别造成循环渲染。
- 个人偏好的多设备同步（目前只在本机）。
- 自动存草稿、完成度提示。
