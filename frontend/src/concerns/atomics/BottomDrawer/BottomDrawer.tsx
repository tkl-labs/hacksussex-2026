import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import {
  useRef,
  useMemo,
  ReactNode,
  useCallback,
  useLayoutEffect,
  RefObject,
} from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme";
import { IconButton, NavigationHeader } from "@concerns/atomics";
import { CloseIcon } from "@concerns/atomics/Icons";

type BottomDrawerProps = Omit<BottomSheetModalProps, "children"> & {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  maximumViewPercentage?: number;
  backgroundColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  drawerRef?: RefObject<BottomSheetModal | null>;
  disableBackdrop?: boolean;
  headerTitle?: string;
  headerNavButton?: ReactNode;
  data?: any;
};

const BottomDrawer = ({
  children,
  isOpen,
  onClose,
  maximumViewPercentage,
  backgroundColor,
  contentContainerStyle,
  drawerRef: initialDrawerRef,
  style,
  handleIndicatorStyle,
  backgroundStyle,
  headerTitle,
  data,
  ...props
}: BottomDrawerProps) => {
  const defaultDrawerRef = useRef<BottomSheetModal>(null);
  const drawerRef = initialDrawerRef ?? defaultDrawerRef;

  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const { height } = useWindowDimensions();

  const maxDynamicContentSize = useMemo(() => {
    if (
      !!maximumViewPercentage &&
      maximumViewPercentage > 0 &&
      maximumViewPercentage <= 1
    ) {
      return height * maximumViewPercentage;
    } else {
      return height * 0.85;
    }
  }, [height, maximumViewPercentage]);

  useLayoutEffect(() => {
    if (isOpen) {
      drawerRef.current?.present();
    } else {
      drawerRef.current?.close();
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index < 0) {
        onClose();
        drawerRef.current?.close();
      }
    },
    [onClose],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        handle: {
          marginVertical: 15,
          backgroundColor: theme.colors.outlineVariant,
          width: 40,
          height: 6,
        },
        background: {
          backgroundColor: backgroundColor ?? theme.colors.surface,
          borderRadius: theme.borderRadius.fiftyPercent,
        },
        viewContainer: {
          paddingBottom: Math.max(insets.bottom, theme.gutterPadding),
          backgroundColor: backgroundColor ?? theme.colors.surface,
        },
        contentContainer: {
          paddingHorizontal: theme.gutterPadding,
        },
        header: {
          paddingBottom: theme.spacing(1),
          backgroundColor: backgroundColor ?? theme.colors.surface,
        },
      }),
    [theme, backgroundColor, insets],
  );

  return (
    <BottomSheetModal
      ref={drawerRef}
      onDismiss={onClose}
      enableDismissOnClose
      onChange={handleSheetChanges}
      maxDynamicContentSize={maxDynamicContentSize}
      handleIndicatorStyle={[styles.handle, handleIndicatorStyle]}
      backgroundStyle={[styles.background, backgroundStyle]}
      style={style}
      {...props}
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.viewContainer}
        bounces={false}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <NavigationHeader
          title={headerTitle}
          rightNode={<IconButton icon={<CloseIcon />} onPress={onClose} />}
        />
        <View style={[styles.contentContainer, contentContainerStyle]}>
          {children}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export { BottomDrawer };

export type { BottomDrawerProps };
