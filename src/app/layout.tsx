import { ReactNode } from "react";
import { VersionDisplay } from "@/components/atoms/version-display";
import { usePlatform } from "@/hooks/use-capacitor";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { isNative } = usePlatform();

  return (
    <div
      className="min-h-screen"
      style={isNative ? {
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      } : undefined}
    >
      <main className="">{children}</main>
      <VersionDisplay position="bottom-right" variant="default" />
    </div>
  );
}
