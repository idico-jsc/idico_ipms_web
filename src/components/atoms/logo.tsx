import { cn } from "@/utils/index";
import logoPrimary from "@/assets/images/logo/idico-primary-ver.svg";
import logoWhite from "@/assets/images/logo/idico-white-ver.svg";
import logoIcon from "@/assets/images/logo/logo-icon-ver.svg";

interface LogoProps extends React.ComponentProps<"img"> {
  /**
   * Size variant of the logo
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Logo variant to display
   * - "default": default logo with text (idico-primary-ver.svg)
   * - "icon": icon only (logo-icon-ver.svg)
   * - "white": White version for dark backgrounds (idico-white-ver.svg)
   * @default "default"
   */
  variant?: "default" | "icon" | "white";
}

const sizeVariants = {
  sm: {
    height: "h-6"
  },
  md: {
    height: "h-8",
  },
  lg: {
    height: "h-10",
  },
  xl: {
    height: "h-12",
  },
};

const logoSources = {
  default: logoPrimary,
  icon: logoIcon,
  white: logoWhite,
};

export const Logo = ({
  size = "md",
  variant = "default",
  className,
  ...props
}: LogoProps) => {
  const sizes = sizeVariants[size];
  const logoSrc = logoSources[variant];

  return (
   <img
        src={logoSrc}
        alt="IDICO Logo"
        className={cn("object-contain", sizes.height, className)}
        { ...props}
      />
  );
};
