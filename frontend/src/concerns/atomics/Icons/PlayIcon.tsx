import { Icon, SvgIconProps } from "@concerns/atomics/Icons";
import PlayIconSvg from "@assets/icons/play.svg";

export const PlayIcon = (props: SvgIconProps) => (
  <Icon source={PlayIconSvg} {...props} />
);
