import { useTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";
import type { AppColors } from "./colors";

export interface AppTheme extends MD3Theme {
  colors: MD3Theme["colors"] & AppColors;
  spacing: (multiplier: number) => number;
  gutterPadding: number;
  componentSpacing: number;
  innerComponentSpacing: number;
  borderRadius: {
    sharp: number;
    small: number;
    medium: number;
    semiRound: number;
    round: number;
    fiftyPercent: number;
  };
}

export const useAppTheme = () => useTheme<AppTheme>();
