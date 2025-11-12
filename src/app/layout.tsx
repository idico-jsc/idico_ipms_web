import { ReactNode } from "react";
import { VersionDisplay } from "@/components/atoms/version-display";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen">
      <main className="">{children}</main>
      <VersionDisplay position="bottom-right" variant="default" />
    </div>
  );
}
