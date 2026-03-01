import { Icon, SvgIconProps } from "@concerns/atomics/Icons";
import MapIconSvg from "@assets/icons/map.svg";

export const MapIcon = (props: SvgIconProps) => (
  <Icon source={MapIconSvg} {...props} />
);
