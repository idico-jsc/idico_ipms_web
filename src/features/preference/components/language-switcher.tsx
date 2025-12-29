import { useLanguage } from "@/hooks/use-language";
import { Button } from "@atoms/button";
import { cn } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@atoms/dropdown-menu";
import { Check } from "lucide-react";
import type { LanguageCode } from "@/constants/languages";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export function LanguageSwitcher({ className, variant = "outline" }: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode as LanguageCode);
  };

  // Extract base language code (e.g., "en-US" -> "en")
  const baseLanguageCode = currentLanguage.split("-")[0];

  const currentLang = supportedLanguages.find(
    (lang) => lang.code === baseLanguageCode || lang.code === currentLanguage,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          className={cn("text-foreground bg-black/5 dark:bg-white/5 border-none rounded-full gap-1", className)}
        >
          <span className="text-base" role="img" aria-label="flag">
            {currentLang?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {supportedLanguages.map((lang) => {
          const isActive = currentLanguage === lang.code || baseLanguageCode === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                isActive && "bg-accent/50 font-medium"
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1">{lang.nativeName}</span>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
