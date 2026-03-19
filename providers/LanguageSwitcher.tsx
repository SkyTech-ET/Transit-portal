"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

interface LanguageOption {
  code: string;
  label: string;
}

const languages: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<string>("en");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect current locale from the path
  useEffect(() => {
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "am") {
      setCurrentLocale(segments[1]);
    }
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchTo = (locale: string) => {
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "am") {
      segments[1] = locale;
    } else {
      segments.unshift("", locale);
    }
    router.push(segments.join("/"));
    setOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLocale);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current language button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md md:text-base"
      >
        {currentLanguage?.label}
        <svg
          className={clsx("ml-1 h-3 w-3 transition-transform", {
            "rotate-180": open,
          })}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchTo(lang.code)}
              className={clsx(
                "w-full px-4 py-2 text-left text-sm transition-colors duration-200 hover:bg-blue-50",
                lang.code === currentLocale
                  ? "font-semibold text-blue-600"
                  : "text-gray-700"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
