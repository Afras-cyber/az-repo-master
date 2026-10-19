import type { Metadata } from "next";
import AppNavigation from "./components/app-navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repo Master",
  description:
    "Explore your code, ask questions, and uncover insights from your repository.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-text">
        <div className="min-h-screen desktop:flex">
          <AppNavigation />
          <div className="min-w-0 flex-1 pb-mobile-tabbar desktop:pb-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
