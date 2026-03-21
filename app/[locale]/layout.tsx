import "../../styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageSwitcher } from "@/providers/LanguageSwitcher";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Transit",
  description: "Transit app",
  icons: {
    icon: "/transitlogo.ico",
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AntdRegistry>
            {/* 🔥 Top Header */}
            <div className="mx-6 flex items-center justify-end gap-4 border-b bg-white px-3 py-1">
              {/* Profile icon comes here (later) */}
              <LanguageSwitcher />
            </div>

            {/* Page Content */}
            {children}
          </AntdRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
