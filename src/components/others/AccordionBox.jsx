import React from "react";
import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

export default function AccordionBox({
  summary_text,
  content,
  colors,
  defaultOpen = false,
  /** Optional black icon rendered at the start of the header label. */
  headerIcon = null,
  /** Optional node rendered at the right edge of the header row. */
  headerExtra = null,
  /** Merged into the outer Collapse style (border / radius / margin …). */
  boxStyle = null,
  /** Merged into the label row (used by nested parent boxes). */
  labelStyle = null,
  /** Merged into the children wrapper (padding). */
  contentStyle = null,
}) {
  const items = [
    {
      key: "1",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            width: "100%",
            color: colors?.text || "#000",
            // Long headers (e.g. "Group by: … | Order Rolling Images") wrap
            // instead of overflowing the panel box.
            flexWrap: "wrap",
            rowGap: "8px",
            ...(labelStyle || {}),
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              flex: "1 1 auto",
              minWidth: 0,
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {headerIcon && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  color: colors?.text || "#000",
                  flex: "0 0 auto",
                }}
              >
                {headerIcon}
              </span>
            )}
            {summary_text}
          </span>

          {headerExtra && (
            // stopPropagation so interacting with the controls does NOT toggle
            // the accordion (the whole header row is clickable in antd).
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                flex: "0 1 auto",
                minWidth: 0,
                flexWrap: "wrap",
                justifyContent: "flex-end",
                rowGap: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {headerExtra}
            </span>
          )}
        </div>
      ),
      children: (
        <div
          style={{
            backgroundColor: colors?.background || "#fff",
            color: colors?.text || "#000",
            padding: "16px 0",
            ...(contentStyle || {}),
          }}
        >
          {content}
        </div>
      ),
      style: {
        backgroundColor: colors?.background || "#fff",
        border: "none",
      },
    },
  ];

  return (
    <Collapse
      ghost
      defaultActiveKey={defaultOpen ? ["1"] : []}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined
          rotate={isActive ? 90 : 0}
          style={{
            color: colors?.text || "#000",
            fontSize: "12px",
          }}
        />
      )}
      style={{
        backgroundColor: colors?.background || "#fff",
        border: `1px solid ${colors?.border || "#ccc"}`,
        borderRadius: "8px",
        marginBottom: "16px",
        ...(boxStyle || {}),
      }}
      items={items}
    />
  );
}