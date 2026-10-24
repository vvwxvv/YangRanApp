// hooks/useFetchUrl.js
"use client";

import { useState } from "react";
import { fetchViaProxy, prettyPrint, copyToClipboard } from "@/lib/fetchUtils";

export function useFetchUrl(initialUrl = "") {
  const [url, setUrl] = useState(initialUrl);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "ok" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFetch() {
    if (!url.trim()) return;
    setStatus("loading");
    setOutput("");
    setErrorMsg("");
    try {
      const data = await fetchViaProxy(url.trim());
      setOutput(typeof data === "string" ? data : prettyPrint(data));
      setStatus("ok");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  function handleCopy() {
    copyToClipboard(output);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleFetch();
  }

  return {
    url,
    setUrl,
    output,
    status,
    errorMsg,
    handleFetch,
    handleCopy,
    handleKeyDown,
  };
}