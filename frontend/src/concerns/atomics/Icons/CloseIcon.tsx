import { Icon, SvgIconProps } from "@concerns/atomics/Icons";
import CloseIconSvg from "@assets/icons/close.svg";

export const CloseIcon = (props: SvgIconProps) => (
  <Icon source={CloseIconSvg} {...props} />
);
