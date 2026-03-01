import { Icon, SvgIconProps } from "@concerns/atomics/Icons";
import MapPinIconSvg from "@assets/icons/map-pin.svg";

export const MapPinIcon = (props: SvgIconProps) => (
  <Icon source={MapPinIconSvg} {...props} />
);
