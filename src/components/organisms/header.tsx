import { NavLink } from 'react-router';
import { LanguageSwitcher } from '@/components/molecules/language-switcher';
import { ThemeToggle } from '@/components/molecules/theme-toggle';
import { SidebarTrigger } from '@/components/atoms/sidebar';

export function Header() {

  return (
    <header className="sticky px-6 top-0 z-50 w-full border-b border-border/80 bg-glass">
      <div className="mx-auto flex gap-10 justify-between h-16 items-center">
        <SidebarTrigger className={"hidden md:block"} />
        {/* Logo */}
        <div className="mr-8">
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="flex flex-col">
              <span className="font-bold text-xl">React TS Starter</span>
            </div>
          </NavLink>
        </div>


        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
