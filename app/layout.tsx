import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Selfhost Directory",
  description: "Discover, compare, and self-host open source projects."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
