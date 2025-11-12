import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/atoms/button";
import { useState } from "react";
import { cn } from "@/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export function LanguageSwitcher({ className, variant = "outline" }: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode as any);
    setIsOpen(false);
  };

  // Extract base language code (e.g., "en-US" -> "en")
  const baseLanguageCode = currentLanguage.split("-")[0];

  const currentLang = supportedLanguages.find(
    (lang) => lang.code === baseLanguageCode || lang.code === currentLanguage,
  );

  return (
    <div className={cn("relative inline-block", className)}>
      <Button
        variant={variant}
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-foreground gap-1"
      >
        <span className="text-base" role="img" aria-label="flag">
          {currentLang?.flag}
        </span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="border-border bg-popover absolute top-full right-0 z-20 mt-2 min-w-[150px] rounded-md border shadow-lg">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "text-popover-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors",
                  currentLanguage === lang.code && "bg-accent/50 font-medium",
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
