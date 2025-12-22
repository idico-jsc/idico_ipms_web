import { LanguageSwitcher } from '@/components/molecules/language-switcher';
import { ThemeToggle } from '@/components/molecules/theme-toggle';
import { UserMenu } from '@/components/organisms/user-menu';
import { SidebarTrigger } from '@/components/atoms/sidebar';
import { useTheme } from '@/hooks';
import { Logo } from '@atoms';

export function Header() {
  const {theme} = useTheme()

  return (
    <header className="sticky px-6 top-0 z-50 w-full border-b border-border/80 bg-glass">
      <div className="mx-auto flex gap-10 justify-between h-16 items-center">
        <SidebarTrigger className={"hidden md:inline-flex"} />
        <Logo className="block md:hidden" variant={theme === "dark" ? "white":"default"} />
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
