"use client";

/**
 * SiteMetaPageComponent — `/manager/meta`
 *
 * Accordion layout, one group per part of the site:
 *   Footer · Navigation menus · SEO & tags · Form type options
 * and inside "Form type options", one collapsible row per entity.
 *
 * Backed by the singleton `Meta` document (`/api/meta`); defaults come from
 * `@/utils/siteMetaDefaults`. Everything here is local UI — the data shape and
 * save behaviour are unchanged from the previous version.
 */

import React, { useContext, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ListTree, Plus, Trash2 } from "lucide-react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useFont from "@/hooks/useFont";
import useSiteMeta from "@/hooks/useSiteMeta";
import { FORM_TYPE_OPTIONS } from "@/utils/siteMetaDefaults";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import { DeviceContext } from "@/components/contexts/DeviceContext";

// ─── tokens ────────────────────────────────────────────────────────────────
const HAIRLINE = (isDark) =>
  isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)";

const PAGE = {
  MAX_WIDTH: 1240,
  PX_DESKTOP: 48,
  PX_MOBILE: 20,
  PT: 28,
  PB: 140,
  TITLE_SIZE: 26,
  CONTROL_HEIGHT: 34,
};

// ─── Entities that own a form "type" list (schema order, no Fair model) ─────
const TYPE_ENTITIES = [
  { key: "artwork", en: "Artwork", cn: "作品" },
  { key: "video", en: "Video", cn: "视频" },
  { key: "series", en: "Series", cn: "系列" },
  { key: "resume", en: "Resume", cn: "简历" },
  { key: "web", en: "Web", cn: "网址" },
  { key: "writing", en: "Writing", cn: "写作" },
  { key: "event", en: "Event", cn: "活动" },
  { key: "bibliography", en: "Bibliography", cn: "文献" },
  { key: "image", en: "Image", cn: "图片" },
  { key: "exhibition", en: "Exhibition", cn: "展览" },
];

// Option groups with no Prisma model behind them — dropped on every save.
const DROPPED_FORM_TYPE_KEYS = ["fair"];

const toCleanOption = (opt = {}) => ({
  label_en: String(opt.label_en ?? opt.value ?? "").trim(),
  label_cn: String(opt.label_cn ?? opt.label_en ?? opt.value ?? "").trim(),
});
const optionLabelEn = (opt = {}) => String(opt.label_en ?? opt.value ?? "");
const optionLabelCn = (opt = {}) => String(opt.label_cn ?? "");

// ─── primitives ────────────────────────────────────────────────────────────
function Chevron({ open, color }) {
  return (
    <ChevronDown
      size={16}
      strokeWidth={1.6}
      color={color}
      style={{
        flexShrink: 0,
        transition: "transform 0.2s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    />
  );
}

function Field({ label, value, onChange, hint, placeholder, multiline, rows = 3, colors, isDark, font }) {
  const [focus, setFocus] = useState(false);
  const shared = {
    width: "100%",
    boxSizing: "border-box",
    // archive style: no box — a single bottom rule (black while focused)
    border: "none",
    borderBottom: `1px solid ${focus ? colors.text : HAIRLINE(isDark)}`,
    borderRadius: 0,
    backgroundColor: "transparent",
    color: colors.text,
    padding: multiline ? "4px 2px 6px" : "0 2px",
    height: multiline ? "auto" : 30,
    fontSize: 12,
    outline: "none",
    fontFamily: font,
    resize: multiline ? "vertical" : "none",
    lineHeight: multiline ? 1.5 : undefined,
    transition: "border-color 0.15s ease",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
      {label ? (
        <span
          style={{
            fontFamily: font,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: colors.text,
            opacity: 0.5,
          }}
        >
          {label}
        </span>
      ) : null}
      {multiline ? (
        <textarea
          rows={rows}
          value={value ?? ""}
          placeholder={placeholder || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={shared}
        />
      ) : (
        <input
          value={value ?? ""}
          placeholder={placeholder || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={shared}
        />
      )}
      {hint ? (
        <span style={{ fontFamily: font, fontSize: 10, color: colors.text, opacity: 0.45 }}>{hint}</span>
      ) : null}
    </div>
  );
}

function IconButton({ title, onClick, children, danger, colors, isDark }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        flexShrink: 0,
        border: "none",
        borderRadius: 0,
        backgroundColor: "transparent",
        color: danger ? "#b00020" : colors.text,
        opacity: hover ? 1 : 0.5,
        cursor: "pointer",
        transition: "opacity 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

function AccentButton({ children, onClick, solid, colors, isDark, font, disabled }) {
  const [hover, setHover] = useState(false);
  // Rendered as a span, not <button>: globals.css forces `button { color:#000
  // !important }`, which made the white label on a solid black button vanish.
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 34,
        padding: "0 16px",
        border: solid ? `1px solid ${colors.text}` : "none",
        borderRadius: 0,
        backgroundColor: solid ? colors.text : "transparent",
        color: solid ? colors.background : colors.text,
        fontFamily: font,
        fontSize: 11,
        fontWeight: solid ? 600 : 400,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        userSelect: "none",
        textDecoration: hover && !solid ? "underline" : "none",
        textUnderlineOffset: 3,
        transition: "opacity 0.15s ease",
      }}
    >
      {children}
    </span>
  );
}

/** One accordion group: hairline row header + collapsible body. */
function Group({ title, subtitle, open, onToggle, children, right, colors, isDark, font, isMobile }) {
  const [hover, setHover] = useState(false);
  return (
    <section style={{ borderTop: `1px solid ${HAIRLINE(isDark)}` }}>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          rowGap: isMobile ? 10 : 0,
          gap: 14,
          padding: "18px 0",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", minWidth: 0 }}>
          <span
            style={{
              fontFamily: font,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: colors.text,
              textDecoration: hover ? "underline" : "none",
              textUnderlineOffset: 3,
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span style={{ fontFamily: font, fontSize: 11.5, color: colors.text, opacity: 0.45 }}>
              {subtitle}
            </span>
          ) : null}
        </div>
        <div style={{ flex: 1 }} />
        {right ? (
          <div
            onClick={(e) => e.stopPropagation()}
            style={isMobile ? { flexBasis: "100%", order: 3 } : undefined}
          >
            {right}
          </div>
        ) : null}
        <Chevron open={open} color={colors.text} />
      </div>
      {open ? (
        <div
          style={{
            // one long vertical rule that hugs everything inside this group
            borderLeft: `1px solid ${HAIRLINE(isDark)}`,
            marginLeft: 1,
            paddingLeft: isMobile ? 16 : 22,
            paddingTop: 6,
            paddingBottom: 22,
          }}
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}

/** Nested collapsible row used for each entity inside "Form type options". */
function SubGroup({ title, count, open, onToggle, children, colors, isDark, font }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ borderTop: `1px solid ${HAIRLINE(isDark)}` }}>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "11px 0",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontFamily: font,
            fontSize: 12,
            fontWeight: 600,
            color: colors.text,
            textDecoration: hover ? "underline" : "none",
            textUnderlineOffset: 3,
          }}
        >
          {title}
        </span>
        <span style={{ fontFamily: font, fontSize: 10.5, color: colors.text, opacity: 0.4 }}>
          {count}
        </span>
        <div style={{ flex: 1 }} />
        <Chevron open={open} color={colors.text} />
      </div>
      {open ? (
        <div
          style={{
            borderLeft: `1px dashed ${HAIRLINE(isDark)}`,
            marginLeft: 1,
            paddingLeft: 18,
            paddingTop: 4,
            paddingBottom: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** label + href row editor (one level of dropdown children). */
function MenuItemRows({ items = [], onChange, t, colors, isDark, font }) {
  const update = (index, patch) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, { label: "", href: "" }]);
  const addChild = (index) =>
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, dropdown: [...(item.dropdown || []), { label: "", href: "" }] } : item
      )
    );

  const colLabel = {
    fontFamily: font,
    fontSize: 10,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.text,
    opacity: 0.45,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", gap: 10, paddingBottom: 8 }}>
        <span style={{ ...colLabel, flex: "1 1 200px" }}>{t.label}</span>
        <span style={{ ...colLabel, flex: "1 1 240px" }}>{t.href}</span>
      </div>
      {items.map((item, index) => (
        <div key={index} style={{ borderTop: `1px solid ${HAIRLINE(isDark)}`, padding: "12px 0" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px", minWidth: 140 }}>
              <Field value={item.label} onChange={(v) => update(index, { label: v })} colors={colors} isDark={isDark} font={font} />
            </div>
            <div style={{ flex: "1 1 240px", minWidth: 160 }}>
              <Field value={item.href} onChange={(v) => update(index, { href: v })} colors={colors} isDark={isDark} font={font} />
            </div>
            <IconButton title={t.addChild} onClick={() => addChild(index)} colors={colors} isDark={isDark}>
              <ListTree size={14} strokeWidth={1.6} />
            </IconButton>
            <IconButton title={t.remove} onClick={() => remove(index)} danger colors={colors} isDark={isDark}>
              <Trash2 size={14} strokeWidth={1.6} />
            </IconButton>
          </div>

          {item.dropdown?.length ? (
            <div
              style={{
                marginTop: 10,
                paddingLeft: 16,
                borderLeft: `1px dashed ${HAIRLINE(isDark)}`,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {item.dropdown.map((child, ci) => (
                <div key={ci} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px", minWidth: 140 }}>
                    <Field
                      value={child.label}
                      onChange={(v) =>
                        update(index, {
                          dropdown: item.dropdown.map((c, i) => (i === ci ? { ...c, label: v } : c)),
                        })
                      }
                      colors={colors}
                      isDark={isDark}
                      font={font}
                    />
                  </div>
                  <div style={{ flex: "1 1 240px", minWidth: 160 }}>
                    <Field
                      value={child.href}
                      onChange={(v) =>
                        update(index, {
                          dropdown: item.dropdown.map((c, i) => (i === ci ? { ...c, href: v } : c)),
                        })
                      }
                      colors={colors}
                      isDark={isDark}
                      font={font}
                    />
                  </div>
                  <IconButton
                    title={t.remove}
                    danger
                    onClick={() =>
                      update(index, { dropdown: item.dropdown.filter((_, i) => i !== ci) })
                    }
                    colors={colors}
                    isDark={isDark}
                  >
                    <Trash2 size={14} strokeWidth={1.6} />
                  </IconButton>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}

      <div style={{ borderTop: `1px solid ${HAIRLINE(isDark)}`, paddingTop: 12 }}>
        <AccentButton onClick={add} colors={colors} isDark={isDark} font={font}>
          <Plus size={13} strokeWidth={1.8} /> {t.addItem}
        </AccentButton>
      </div>
    </div>
  );
}

// ─── page ──────────────────────────────────────────────────────────────────
export default function SiteMetaPageComponent() {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { colors, isDark } = useReverseTheme();
  const { fontFamily: bodyFont } = useFont("bodyText");
  const { fontFamily: titleFont } = useFont("sectionTitle");

  const { meta, loading, save, saving } = useSiteMeta();

  const [draft, setDraft] = useState(meta);
  const [menuTab, setMenuTab] = useState("managerMenu");
  // Everything bilingual follows the site language — no EN/CN picker.
  const langKey = isCn ? "cn" : "en";
  const [status, setStatus] = useState(null);

  // Accordion state. First group open by default so the page isn't a wall.
  const [open, setOpen] = useState({
    footer: true,
    menus: false,
    seo: false,
    types: false,
  });
  const [openType, setOpenType] = useState({});
  const toggle = (key) => setOpen((d) => ({ ...d, [key]: !d[key] }));
  const toggleType = (key) => setOpenType((d) => ({ ...d, [key]: !d[key] }));

  useEffect(() => {
    setDraft(meta);
  }, [meta]);
  const t = useMemo(
    () =>
      isCn
        ? {
            title: "站点信息",
            subtitle: "页脚 · 导航菜单 · SEO — 全部在此维护",
            save: "保存更改",
            saved: "已保存",
            saving: "保存中…",
            failed: "保存失败",
            footer: "页脚",
            footerHint: "公司名称、起始年份、版权文字",
            menus: "导航菜单",
            menusHint: "公开菜单与后台菜单（含下拉子项）",
            seo: "SEO 与标签",
            seoHint: "标题、描述、关键词、分享图",
            label: "名称",
            childLabel: "子项名称",
            href: "链接",
            addItem: "添加一项",
            addChild: "添加子项",
            remove: "删除",
            mainMenu: "公开菜单",
            managerMenu: "后台菜单",
            company: "公司名称",
            startYear: "起始年份",
            rights: "版权文字",
            seoTitle: "SEO 标题",
            seoDesc: "SEO 描述",
            keywords: "关键词",
            ogImage: "分享图 (og:image)",
            icon: "站点图标",
            canonical: "规范链接 (canonical)",
            author: "作者",
            jsonNote: "图库实体映射（galleryEntities）保持只读，如需修改请告知。",
            formTypes: "表单类型选项",
            formTypesHint: "每个实体的 type 下拉选项",
            name: "名称",
            addType: "添加类型",
          }
        : {
            title: "Site Meta",
            subtitle: "Footer · Navigation · SEO — all maintained here",
            save: "Save changes",
            saved: "Saved",
            saving: "Saving…",
            failed: "Save failed",
            footer: "Footer",
            footerHint: "Company name, start year, rights text",
            menus: "Navigation menus",
            menusHint: "Public + manager menus (with dropdown children)",
            seo: "SEO & tags",
            seoHint: "Title, description, keywords, share image",
            label: "Label",
            childLabel: "Child label",
            href: "Href",
            addItem: "Add item",
            addChild: "Add child",
            remove: "Remove",
            mainMenu: "Public menu",
            managerMenu: "Manager menu",
            company: "Company name",
            startYear: "Start year",
            rights: "Rights text",
            seoTitle: "SEO title",
            seoDesc: "SEO description",
            keywords: "Keywords",
            ogImage: "Share image (og:image)",
            icon: "Site icon",
            canonical: "Canonical URL",
            author: "Author",
            jsonNote: "The image-gallery entity mapping (galleryEntities) stays read-only.",
            formTypes: "Form type options",
            formTypesHint: "Type dropdown options per entity",
            name: "Name",
            addType: "Add type",
          },
    [isCn]
  );

  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));
  const setIn = (key, sub) => (value) =>
    setDraft((d) => ({ ...d, [key]: { ...(d[key] || {}), [sub]: value } }));

  const formTypes = draft?.formTypes || {};
  const setFormTypeList = (entity, list) =>
    setDraft((d) => ({
      ...d,
      formTypes: { ...(d.formTypes || {}), [entity]: list.map(toCleanOption) },
    }));

  const handleSave = async () => {
    setStatus(null);
    try {
      const formTypesClean = { ...(draft?.formTypes || {}) };
      DROPPED_FORM_TYPE_KEYS.forEach((key) => delete formTypesClean[key]);
      await save({ ...draft, formTypes: formTypesClean });
      setStatus("ok");
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      console.log(err);
      setStatus("error");
    }
  };

  const menuList = draft?.menu?.[menuTab]?.[langKey] || [];
  const setMenuList = (items) =>
    setDraft((d) => ({
      ...d,
      menu: {
        ...(d.menu || {}),
        [menuTab]: { ...(d.menu?.[menuTab] || {}), [langKey]: items },
      },
    }));

  const pill = (active) => ({
    display: "inline-flex",
    alignItems: "center",
    height: 26,
    padding: "0 10px",
    border: `1px solid ${active ? colors.text : HAIRLINE(isDark)}`,
    backgroundColor: active ? colors.text : "transparent",
    color: active ? colors.background : colors.text,
    fontFamily: bodyFont,
    fontSize: 10.5,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    whiteSpace: "nowrap",
    userSelect: "none",
  });

  const row = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: 14,
  };
  const row3 = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
    gap: 14,
  };

  const fieldProps = { colors, isDark, font: bodyFont };

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
        padding: `${PAGE.PT}px ${isMobile ? PAGE.PX_MOBILE : PAGE.PX_DESKTOP}px ${PAGE.PB}px`,
      }}
    >
      <div style={{ maxWidth: PAGE.MAX_WIDTH, margin: "0 auto" }}>
        {/* ── Header ── */}
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: titleFont,
                fontSize: PAGE.TITLE_SIZE,
                fontWeight: 400,
                letterSpacing: "0.02em",
                margin: 0,
                color: colors.text,
              }}
            >
              {t.title}
            </h1>
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.45,
                margin: "6px 0 0",
              }}
            >
              {t.subtitle}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {status === "ok" ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: bodyFont,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0a7d28",
                }}
              >
                <Check size={13} strokeWidth={2} /> {t.saved}
              </span>
            ) : null}
            {status === "error" ? (
              <span style={{ fontFamily: bodyFont, fontSize: 11, color: "#b00020" }}>
                {t.failed}
              </span>
            ) : null}
            <AccentButton onClick={handleSave} solid disabled={saving} colors={colors} isDark={isDark} font={bodyFont}>
              <Check size={13} strokeWidth={2} />
              {saving ? t.saving : t.save}
            </AccentButton>
          </div>
        </header>

        {/* ── Footer ── */}
        <Group title={t.footer} subtitle={t.footerHint} open={open.footer} onToggle={() => toggle("footer")} colors={colors} isDark={isDark} font={bodyFont} isMobile={isMobile}>
          <div style={row}>
            <Field
              label={t.company}
              value={(isCn ? draft.app_footer_cn : draft.app_footer_en) ?? ""}
              onChange={set(isCn ? "app_footer_cn" : "app_footer_en")}
              {...fieldProps}
            />
            <Field
              label={t.startYear}
              value={draft.app_footer_start_year ?? ""}
              onChange={(v) => set("app_footer_start_year")(v === "" ? null : Number(v))}
              {...fieldProps}
            />
          </div>
          <div style={{ ...row, marginTop: 14 }}>
            <Field
              label={t.rights}
              value={(isCn ? draft.app_footer_rights_cn : draft.app_footer_rights_en) ?? ""}
              onChange={set(isCn ? "app_footer_rights_cn" : "app_footer_rights_en")}
              {...fieldProps}
            />
          </div>
        </Group>

        {/* ── Menus ── */}
        <Group
          title={t.menus}
          subtitle={t.menusHint}
          open={open.menus}
          onToggle={() => toggle("menus")}
          colors={colors}
          isDark={isDark}
          font={bodyFont}
          isMobile={isMobile}
          right={
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", gap: 6 }}>
                {[
                  ["mainMenu", t.mainMenu],
                  ["managerMenu", t.managerMenu],
                ].map(([key, label]) => (
                  <span key={key} role="button" tabIndex={0} onClick={() => setMenuTab(key)} style={pill(menuTab === key)}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          }
        >
          <MenuItemRows items={menuList} onChange={setMenuList} t={t} {...fieldProps} />
          <p style={{ fontFamily: bodyFont, fontSize: 10.5, opacity: 0.45, margin: "12px 0 0" }}>
            {t.jsonNote}
          </p>
        </Group>

        {/* ── SEO ── */}
        <Group title={t.seo} subtitle={t.seoHint} open={open.seo} onToggle={() => toggle("seo")} colors={colors} isDark={isDark} font={bodyFont} isMobile={isMobile}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label={t.seoTitle} value={draft.seo?.title} onChange={setIn("seo", "title")} {...fieldProps} />
            <Field label={t.seoDesc} value={draft.seo?.description} onChange={setIn("seo", "description")} multiline rows={3} {...fieldProps} />
            <div style={row}>
              <Field label={t.keywords} value={draft.seo?.keywords} onChange={setIn("seo", "keywords")} {...fieldProps} />
              <Field label={t.author} value={draft.seo?.author} onChange={setIn("seo", "author")} {...fieldProps} />
            </div>
            <div style={row3}>
              <Field label={t.ogImage} value={draft.seo?.og_image} onChange={setIn("seo", "og_image")} {...fieldProps} />
              <Field label={t.icon} value={draft.seo?.icon} onChange={setIn("seo", "icon")} {...fieldProps} />
              <Field label={t.canonical} value={draft.seo?.canonical} onChange={setIn("seo", "canonical")} {...fieldProps} />
            </div>
          </div>
        </Group>


        <div style={{ borderTop: `1px solid ${HAIRLINE(isDark)}` }} />

        {loading ? (
          <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.4, paddingTop: 16 }}>
            loading…
          </p>
        ) : null}
      </div>
    </div>
  );
}
