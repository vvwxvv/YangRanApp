// lib/fetchUtils.js

export function prettyPrint(data) {
    return JSON.stringify(data, null, 2);
  }
  
  export async function fetchViaProxy(targetUrl) {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) return res.json();
    return res.text();
  }
  
  export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  }