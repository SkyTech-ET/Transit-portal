"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GlobalOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";

const languages = [
  { key: "en", label: "English", flag: "🇺🇸" },
  { key: "am", label: "አማርኛ", flag: "🇪🇹" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  //  Switch language
  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split("/");

    if (segments[1] === "en" || segments[1] === "am") {
      segments[1] = newLocale;
    } else {
      segments.unshift("", newLocale);
    }

    // Save to localStorage
    localStorage.setItem("locale", newLocale);

    //  Save to cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;

    router.push(segments.join("/"));
    setOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved && saved !== locale) {
      switchLanguage(saved);
    }
  }, []);

  const current = languages.find((l) => l.key === locale);

  return (
    <div className="relative" ref={ref}>
      {/* 🌍 Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-md transition hover:shadow-lg"
      >
        <GlobalOutlined />
        <span>{current?.flag}</span>
        <span>{current?.label}</span>
        <span className="text-xs">▾</span>
      </button>

      {/* 🎬 Animated Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-60 rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-xl backdrop-blur-md"
          >
            {languages.map((lang) => (
              <div
                key={lang.key}
                onClick={() => switchLanguage(lang.key)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-100"
              >
                {/* Left side */}
                <div className="flex items-center gap-3">
                  {/* 🌍 Flag */}
                  <span className="text-lg">{lang.flag}</span>

                  {/* Label */}
                  <span
                    className={clsx(
                      "text-sm",
                      locale === lang.key
                        ? "font-medium text-black"
                        : "text-gray-600"
                    )}
                  >
                    {lang.label}
                  </span>
                </div>

                {/* Radio */}
                <div
                  className={clsx(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    locale === lang.key ? "border-blue-600" : "border-gray-400"
                  )}
                >
                  {locale === lang.key && (
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
