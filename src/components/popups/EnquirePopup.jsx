"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnquirePopup({ isOpen, onClose, artwork, isCn, fontFamily, colors }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [isHovered, setIsHovered] = useState(false);

  if (!isOpen || !artwork) return null;

  const text = colors?.text || "#000000";
  const bg = colors?.background || "#ffffff";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          related_artist: artwork.artist,
          related_artwork_title: artwork.title,
          status: "Pending",
        }),
      });

      if (!response.ok) {
        console.log("Submission failed with status: ", response.status);
        setStatus("error");
        return;
      }
      
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setFormData({ name: "", email: "", phone: "", message: "" });
        onClose();
      }, 2000);
    } catch (err) {
      console.log("Fetch error during submission: ", err);
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    fontFamily,
    fontSize: "12px",
    border: `1px solid ${text}40`,
    backgroundColor: "transparent",
    color: text,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: bg,
            color: text,
            width: "100%",
            maxWidth: "500px",
            padding: isMobile ? "30px 20px" : "40px",
            position: "relative",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              outline: "none",
              cursor: "pointer",
              color: text,
              fontSize: "24px",
              padding: "5px",
              fontWeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>

          <h2 style={{ fontFamily, fontSize: "18px", margin: "0 0 30px", fontWeight: 400 }}>
            {isCn ? "咨询表单" : "Enquire Form"}
          </h2>

          {/* Artwork Thumbnail Info */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <div style={{ width: "80px", height: "80px", flexShrink: 0, backgroundColor: "rgba(0,0,0,0.05)" }}>
              {artwork.cover_img_url && (
                <img
                  src={artwork.cover_img_url}
                  alt={artwork.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily, fontSize: "13px", margin: "0 0 4px", opacity: 0.9 }}>{artwork.artist}</p>
              <p style={{ fontFamily, fontSize: "13px", margin: "0 0 4px", fontStyle: "italic" }}>{artwork.title}</p>
              <p style={{ fontFamily, fontSize: "11px", margin: 0, opacity: 0.5, letterSpacing: "0.03em" }}>
                {[artwork.year, artwork.medium, artwork.size].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          {/* Form */}
          {status === "success" ? (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <p style={{ fontFamily, fontSize: "14px", fontWeight: 300 }}>
                {isCn ? "感谢您的咨询，我们将尽快与您联系。" : "Thank you for your enquiry. We will get back to you soon."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label style={{ fontFamily, fontSize: "12px", width: "90px", flexShrink: 0 }}>{isCn ? "姓名 *" : "Name *"}</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label style={{ fontFamily, fontSize: "12px", width: "90px", flexShrink: 0 }}>{isCn ? "邮箱 *" : "Email *"}</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label style={{ fontFamily, fontSize: "12px", width: "90px", flexShrink: 0 }}>{isCn ? "电话" : "Phone"}</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <label style={{ fontFamily, fontSize: "12px", width: "90px", flexShrink: 0, marginTop: "10px" }}>{isCn ? "留言" : "Message"}</label>
                <textarea name="message" rows="4" value={formData.message} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              {/* Submit Button with Animated Underline and No Background */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    background: "transparent",
                    backgroundColor: "transparent",
                    color: text,
                    border: "none",
                    outline: "none",
                    padding: "4px 0",
                    fontFamily,
                    fontSize: "12px",
                    cursor: status === "submitting" ? "not-allowed" : "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    opacity: status === "submitting" ? 0.5 : 1,
                    position: "relative",
                    WebkitAppearance: "none",
                  }}
                >
                  {status === "submitting" ? (isCn ? "提交中..." : "Submitting...") : (isCn ? "提交" : "Submit")}
                  
                  {/* Underline Animation */}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered && status !== "submitting" ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      backgroundColor: text,
                      transformOrigin: "left",
                    }}
                  />
                </button>
              </div>

              {status === "error" && (
                <p style={{ color: "red", fontSize: "11px", textAlign: "right", margin: 0 }}>
                  {isCn ? "提交失败，请重试。" : "Failed to submit. Please try again."}
                </p>
              )}

              <p style={{ fontSize: "10px", opacity: 0.4, marginTop: "10px", lineHeight: 1.5, fontFamily }}>
                * {isCn 
                    ? "必填项。为了回应您的咨询，我们将根据我们的隐私政策处理您提供的个人数据。" 
                    : "denotes required fields. In order to respond to your enquiry, we will process the personal data you have supplied in accordance with our privacy policy."}
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}