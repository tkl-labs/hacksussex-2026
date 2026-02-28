import { Icon, SvgIconProps } from "@concerns/atomics/Icons";
import SettingsIconSvg from "@assets/icons/settings.svg";

export const SettingsIcon = (props: SvgIconProps) => (
  <Icon source={SettingsIconSvg} {...props} />
);
