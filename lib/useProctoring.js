"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useProctoring({ enabled = true, onCancel } = {}) {
  const maxFlags = parseInt(process.env.NEXT_PUBLIC_MAX_FLAGS || "3", 10);
  const [flagCount, setFlagCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);
  const flagCountRef = useRef(0);
  const isEnabledRef = useRef(enabled);

  useEffect(() => {
    isEnabledRef.current = enabled;
  }, [enabled]);

  const addFlag = useCallback(
    (reason) => {
      if (!isEnabledRef.current || isCancelled) return;

      const newCount = flagCountRef.current + 1;
      flagCountRef.current = newCount;
      setFlagCount(newCount);

      if (newCount >= maxFlags) {
        setIsCancelled(true);
        setWarningMessage(
          `Interview cancelled! You received ${newCount} flags for suspicious activity.`
        );
        setShowWarning(true);
        if (onCancel) {
          setTimeout(() => onCancel(), 3000);
        }
      } else {
        setWarningMessage(
          `⚠️ Warning ${newCount}/${maxFlags}: ${reason}. ${maxFlags - newCount} more and your interview will be cancelled.`
        );
        setShowWarning(true);
      }
    },
    [maxFlags, isCancelled, onCancel]
  );

  // Fullscreen management
  const requestFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.error("Fullscreen request failed:", err);
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.error("Exit fullscreen failed:", err);
    }
  }, []);

  // Detect fullscreen changes
  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);

      // Flag when user exits fullscreen (but not on initial load)
      if (!isFS && flagCountRef.current >= 0 && isEnabledRef.current) {
        // Small delay to avoid flagging on initial fullscreen request
        setTimeout(() => {
          if (!document.fullscreenElement && isEnabledRef.current) {
            addFlag("Exited fullscreen mode");
          }
        }, 500);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [enabled, addFlag]);

  // Detect tab switches
  useEffect(() => {
    if (!enabled) return;

    let lastVisibilityTime = Date.now();

    const handleVisibilityChange = () => {
      if (document.hidden && isEnabledRef.current) {
        lastVisibilityTime = Date.now();
        addFlag("Switched to another tab");
      }
    };

    const handleBlur = () => {
      // Only flag if window actually lost focus (not just a modal)
      if (isEnabledRef.current && Date.now() - lastVisibilityTime > 200) {
        // Avoid double-flagging with visibility change
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled, addFlag]);

  // Keyboard shortcut prevention (Alt+Tab, Ctrl+Tab, etc.)
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Prevent common shortcuts to leave the page
      if (
        (e.altKey && e.key === "Tab") ||
        (e.ctrlKey && e.key === "Tab") ||
        (e.metaKey && e.key === "Tab")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);

  const dismissWarning = useCallback(() => {
    if (!isCancelled) {
      setShowWarning(false);
      // Re-request fullscreen after warning
      if (!document.fullscreenElement) {
        requestFullscreen();
      }
    }
  }, [isCancelled, requestFullscreen]);

  return {
    flagCount,
    maxFlags,
    isFullscreen,
    showWarning,
    warningMessage,
    isCancelled,
    requestFullscreen,
    exitFullscreen,
    dismissWarning,
  };
}
