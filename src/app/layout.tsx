import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "소리의 일기",
  description: "소리의 일기 - 개인 블로그",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="container mx-auto px-4 flex-grow">{children}</main>
          <footer className="py-6 bg-gray-100 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              Copyright © 2025 소리
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
