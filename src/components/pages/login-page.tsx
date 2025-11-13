import { HTMLAttributes, type FC } from "react";
import { cn } from "@/utils";
import { ScreenLayout } from "@templates";
import { useTranslation } from "react-i18next";
import { LoginForm } from "@/features/auth/components/login-form";
import { LoginSlider } from "@/features/auth/components/login-slider";
import { LanguageSwitcher } from "@molecules";
import { ThemeToggle } from "@molecules";

export type LoginPageProps = HTMLAttributes<HTMLDivElement> & {};

export const LoginPage: FC<LoginPageProps> = ({ className }) => {
  const { t } = useTranslation(["pages", "common"]);

  return (
    <ScreenLayout className={cn(className)}>
      <Card className="max-w-[1200px] overflow-hidden rounded-lg shadow-2xl backdrop-blur-sm lg:w-full">
        <CardContent className="grid h-full w-full grid-cols-1 p-0 lg:grid-cols-[55%_auto]">
          {/* Left side - Carousel (hidden on mobile) */}
          <div className="hidden h-full lg:block">
            <div className="relative h-full w-full overflow-hidden p-4 pr-0">
              <div className="h-full overflow-hidden rounded-lg">
                <LoginSlider />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between p-10">
            <div className="flex justify-end gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <div className="flex flex-1 flex-col px-5 py-5 lg:px-0 lg:py-20">
              <div className="mb-8 space-y-2 text-center">
                <h4 className="text-3xl font-bold tracking-tight uppercase">
                  {t("common:app_name")}
                </h4>
                <p className="text-base">{t("auth.login.welcome")}</p>
              </div>
              <div>
                <LoginForm />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScreenLayout>
  );
};
