"use client";

import { useEffect } from "react";

// Registers the PWA service worker so the wallet can be installed to the home
// screen and opens offline. No-op where service workers aren't supported.
export function SWRegister() {
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
