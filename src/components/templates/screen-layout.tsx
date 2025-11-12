import { HTMLAttributes, PropsWithChildren, type FC } from "react";
import { cn } from "@/utils";

export type ScreenLayoutProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren & {};

export const ScreenLayout: FC<ScreenLayoutProps> = ({ className, children }) => {
  return (
    <div className={cn("h-screen flex w-full items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden", className)}>
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-primary/5 absolute -top-1/2 -right-1/2 h-full w-full animate-pulse rounded-full bg-gradient-to-br to-transparent blur-3xl" />
        <div className="from-primary/5 absolute -bottom-1/2 -left-1/2 h-full w-full animate-pulse rounded-full bg-gradient-to-tr to-transparent blur-3xl delay-1000" />
      </div>
      {/* Content */}
      <div className="relative z-10 flex w-full h-full items-center justify-center">{children}</div>
    </div>
  );
};
