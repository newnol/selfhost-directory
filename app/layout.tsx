import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://selfhost.io.vn"),
  title: {
    default: "Selfhost Directory",
    template: "%s - Selfhost Directory"
  },
  description: "Discover, compare, and self-host open source projects.",
  openGraph: {
    type: "website",
    siteName: "Selfhost Directory",
    locale: "vi_VN"
  },
  twitter: {
    card: "summary_large_image"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
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
