import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "./components/site-shell";
import CursorDot from "./components/cursor-dot";

export const metadata: Metadata = {
  title: "Thura Nyi | About",
  description: "A little bit about me and my background.",
  icons: { icon: "/assets/monogram.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body data-theme="dark"><SiteShell>{children}</SiteShell><CursorDot /></body>
    </html>
  );
}
