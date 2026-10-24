"use client";

import React, { useState, useContext, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAsyncAction } from "@/hooks/useAsyncAction"; // 引入 useAsyncAction
import { TAP_STYLE } from "@/components/navs/title_text_nav/constants/navigation";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { ManagerContext } from "@/components/contexts/ManagerContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useBackgroundColor from "@/hooks/useBackgroundColor";
import { resolveMenuData } from "@/components/navs/title_text_nav/utils/menuUtils";
import CoverMenuButton from "@/components/buttons/CoverMenuButton";
import DrawerMenuRow from "@/components/navs/title_text_nav/components/DrawerMenuRow";
import CloseButton from "@/components/buttons/CloseButton";

const CoverImgMenuPage = ({ coverImage, onClose }) => {
  const { isMobile }  = useContext(DeviceContext);
  const { isManager } = useContext(ManagerContext);
  const { colors }    = useReverseTheme();

  const { backgroundColor } = useBackgroundColor("white", { useCustomColor: true });

  const menuList   = useMemo(() => resolveMenuData(isManager), [isManager]);
  const validItems = useMemo(() => menuList.filter((item) => item?.href), [menuList]);

  const [menuExpanded, setMenuExpanded] = useState(false);

  // ── 使用 useAsyncAction 包装 onClose，防止快速多次触发 ──
  const handleClosePage = useAsyncAction(
    async () => {
      onClose?.();
    },
    {
      throttleMs: 500,
      onError: (err) => console.warn("Close page error:", err),
    }
  );

  // 关闭菜单（仅UI切换）
  const closeMenu = () => setMenuExpanded(false);
  // 打开菜单
  const openMenu = () => setMenuExpanded(true);

  // 传递给 DrawerMenuRow 的关闭回调：关闭菜单 + 节流页面关闭
  const handleMenuItemClose = () => {
    closeMenu();
    handleClosePage.execute();
  };

  return (
    <div
      style={{
        position: "relative",
        width:    "100%",
        height:   "100%",
        overflow: "hidden",
      }}
    >
      {/* ── Cover Image ── */}
      <motion.div
        animate={{ scale: menuExpanded ? 1.04 : 1 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        style={{ position: "absolute", inset: 0, isolation: "isolate" }}
      >
        <Image
          src={coverImage}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </motion.div>

      {/* Dim overlay */}
      <motion.div
        animate={{ opacity: menuExpanded ? 0.72 : 0.2 }}
        transition={{ duration: 0.5 }}
        style={{
          position:        "absolute",
          inset:           0,
          backgroundColor: "#000",
          zIndex:          1,
        }}
      />

      {/* ── Menu button ── */}
      <AnimatePresence>
        {isMobile && !menuExpanded && (
          <motion.div
            key="cover-btn"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            style={{
              position:  "absolute",
              top:       "90%",
              left:      "50%",
              transform: "translate(-50%, -50%)",
              zIndex:    20,
            }}
          >
            <CoverMenuButton onClick={openMenu} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Menu panel ── */}
      <AnimatePresence>
        {menuExpanded && (
          <motion.div
            key="menu-panel"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position:                "absolute",
              inset:                   0,
              zIndex:                  20,
              backgroundColor:         backgroundColor,
              overflowY:               "auto",
              WebkitOverflowScrolling: "touch",
              display:                 "flex",
              flexDirection:           "column",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <nav
              role="menu"
              aria-label="Main navigation"
              style={{ flex: 1, padding: "60px 40px 0" }}
            >
              {validItems.map((item, index) => (
                <DrawerMenuRow
                  key={item.href || index}
                  item={item}
                  index={index}
                  colors={colors}
                  onClose={handleMenuItemClose}
                  isLast={index === validItems.length - 1}
                />
              ))}
            </nav>

            {/* ── Close button ── */}
            <div
              style={{
                display:        "flex",
                justifyContent: "center",
                paddingBottom:  "40px",
                paddingTop:     "16px",
                flexShrink:     0,
              }}
            >
              <CloseButton
                onClick={closeMenu} // 只关闭菜单，不触发页面关闭
                color={colors.text}
                size={22}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoverImgMenuPage;