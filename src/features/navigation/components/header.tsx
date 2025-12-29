import { LanguageSwitcher, ThemeToggle } from '@/features/preference';
import { UserMenu } from '@/features/auth';
import { SidebarTrigger } from '@atoms/sidebar';
import { Breadcrumb } from './breadcrumb';

export function Header() {
  return (
    <header className="sticky px-4 top-0 z-50 w-full border-b border-border/80 bg-glass hidden md:block">
      <div className="mx-auto flex gap-10 justify-between h-16 items-center">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger />
          {/* Breadcrumb navigation */}
          <Breadcrumb />
        </div>
        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
