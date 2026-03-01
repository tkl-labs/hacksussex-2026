import { Icon, SvgIconProps } from "@concerns/atomics/Icons";
import StarIconSvg from "@assets/icons/star.svg";

export const StarIcon = (props: SvgIconProps) => (
  <Icon source={StarIconSvg} {...props} />
);
