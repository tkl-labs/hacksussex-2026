import { Icon, SvgIconProps } from "@concerns/atomics/Icons";
import CloseIconSvg from "@assets/icons/arrow-left.svg";

export const CloseIcon = (props: SvgIconProps) => <Icon source={CloseIconSvg} {...props} />;