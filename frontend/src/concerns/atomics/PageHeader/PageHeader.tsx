import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {ReactNode} from "react";

type PageHeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export const PageHeader = ({
  left = null,
  center = null,
  right = null,
  containerStyle,
}: PageHeaderProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.left}>{left}</View>
      <View style={styles.center}>{center}</View>
      <View style={styles.right}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
  },
  left: {
    width: 80,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    width: 80,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});