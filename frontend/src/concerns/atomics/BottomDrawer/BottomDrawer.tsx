import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import {
  ReactNode,
  RefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
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
  disableBackdrop,
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
    }
    return height * 0.85;
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
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (backdropProps: any) =>
      disableBackdrop ? null : (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
          pressBehavior="close"
        />
      ),
    [disableBackdrop],
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
          borderTopLeftRadius: theme.borderRadius.round,
          borderTopRightRadius: theme.borderRadius.round,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
        viewContainer: {
          paddingBottom: Math.max(insets.bottom, theme.gutterPadding),
          backgroundColor: backgroundColor ?? theme.colors.surface,
        },
        contentContainer: {
          paddingHorizontal: theme.gutterPadding,
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
      backdropComponent={renderBackdrop}
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
