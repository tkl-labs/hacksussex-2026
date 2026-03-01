import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/theme";
import { Text } from "@concerns/atomics";
import { PlayIcon } from "@concerns/atomics/Icons";
import { BottomDrawer } from "@concerns/atomics/BottomDrawer/BottomDrawer";

export default function WalkScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingTop: theme.spacing(1) + insets.top,
          paddingBottom: theme.spacing(1) + insets.bottom,
        },
        heading: {
          alignSelf: "center",
          paddingHorizontal: theme.gutterPadding,
          paddingBottom: theme.spacing(2),
        },
        scrollView: {
          flex: 1,
        },
        scrollContent: {
          paddingHorizontal: theme.gutterPadding,
          gap: theme.spacing(1),
          paddingBottom: theme.spacing(4),
        },
      }),
    [theme, insets],
  );

  return (
    <View style={styles.container}>
      <Text variant="headline" style={styles.heading}>
        Your List
      </Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <POIListCard
          title="Amex"
          speechText="bla bla bla bla bla bla bla bla bla bla bl a ss hakjahskjhaskjhads"
        />
        <POIListCard
          title="Amex"
          speechText="bla bla bla bla bla bla bla bla bla bla bl a ss hakjahskjhaskjhads"
        />
        <POIListCard
          title="Amex"
          speechText="bla bla bla bla bla bla bla bla bla bla bl a ss hakjahskjhaskjhads"
        />
        <POIListCard
          title="Amex"
          speechText="bla bla bla bla bla bla bla bla bla bla bl a ss hakjahskjhaskjhads"
        />
        <POIListCard
          title="Amex"
          speechText="bla bla bla bla bla bla bla bla bla bla bl a ss hakjahskjhaskjhads"
        />
        <POIListCard
          title="Amex"
          speechText="bla bla bla bla bla bla bla bla bla bla bl a ss hakjahskjhaskjhads"
        />
        <POIListCard
          title="Amex"
          speechText="bla bla bla bla bla bla bla bla bla bla bl a ss hakjahskjhaskjhads"
        />
      </ScrollView>
    </View>
  );
}

type POIListCardProps = {
  title: string;
  speechText: string;
};

const POIListCard = ({ title, speechText }: POIListCardProps) => {
  const theme = useAppTheme();
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing(1.5),
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.semiRound,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
          paddingHorizontal: theme.spacing(1.5),
          paddingVertical: theme.spacing(1.5),
        },
        textContainer: {
          flex: 1,
          gap: theme.spacing(0.5),
        },
        subtitle: {
          color: theme.colors.onSurfaceVariant,
        },
      }),
    [theme],
  );

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => setDrawerOpen(true)}
    >
      <PlayIcon size="xLarge" />
      <View style={styles.textContainer}>
        <Text variant="titleLarge">{title}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {speechText}
        </Text>
      </View>
      <POIDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        headerTitle={title}
        rating={4.7}
        formattedAddress={"Preston Rd, Brighton and Hove, Brighton BN1 6SD, UK"}
        editorialSummary={
          "Large urban park with playgrounds, pitches and a manor house, used for concerts, fairs and circuses."
        }
        openNow={true}
        openingHours={[
          "Monday: Open 24 hours",
          "Tuesday: Open 24 hours",
          "Wednesday: Open 24 hours",
          "Thursday: Open 24 hours",
          "Friday: Open 24 hours",
          "Saturday: Open 24 hours",
          "Sunday: Open 24 hours",
        ]}
      />
    </TouchableOpacity>
  );
};

type POIDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  headerTitle: string;
  rating: number;
  formattedAddress: string;
  editorialSummary: string;
  openNow: boolean;
  openingHours: string[];
};

const POIDrawer = ({ isOpen, onClose, headerTitle }: POIDrawerProps) => {
  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      headerTitle={headerTitle}
    ></BottomDrawer>
  );
};
