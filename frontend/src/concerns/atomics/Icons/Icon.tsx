import { memo, ComponentType } from "react";
import { SvgProps } from "react-native-svg";
import { useAppTheme } from "@/theme";

export type IconSizes = "xSmall" | "small" | "medium" | "large" | "xLarge";

export type IconProps = {
  source: ComponentType<SvgProps>;
  size?: IconSizes | number;
  color?: string;
};

export type SvgIconProps = Omit<IconProps, "source">

const iconSizeMap: Record<IconSizes, number> = {
  xSmall: 12,
  small: 16,
  medium: 24,
  large: 32,
  xLarge: 48,
};

const Icon = memo(({ source: SvgIcon, size = "medium", color }: IconProps) => {
  const theme = useAppTheme();
  const resolvedSize: number =
    typeof size === "number" ? size : iconSizeMap[size];
  const resolvedColor = color ?? theme.colors.primary;

  return (
    <SvgIcon
      width={resolvedSize}
      height={resolvedSize}
      color={resolvedColor}
    />
  );
});

export default Icon;