import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer } from "expo-audio";

import { useAppTheme } from "@/theme";
import { Text } from "@concerns/atomics";
import { PlayIcon, StarIcon } from "@concerns/atomics/Icons";
import { BottomDrawer } from "@concerns/atomics/BottomDrawer/BottomDrawer";
import {
  descPlaces,
  useLazyGetMP3Query,
  useLazyGetPOIsDescQuery,
  useLazySubmitLocationQuery,
} from "@/store/api/mapApi";
import { getCircleCenter } from "@/utility/map";
import { LocationState } from "./map";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

type NowPlaying = { title: string; summary: string; audioUrl: string } | null;

type POIItem = {
  headerTitle: string;
  rating: number;
  formattedAddress: string;
  editorialSummary: string;
  openNow: boolean;
  openingHours: string[];
  lat: number;
  lng: number;
  audioUrl?: string;
};
import { Directory, File, Paths } from "expo-file-system";

export default function WalkScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [heading, setHeading] = useState<number>(0);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(null);
  const [selectedPOI, setSelectedPOI] = useState<POIItem | null>(null);
  const [poiAudioMap, setPoiAudioMap] = useState<Record<string, string>>({});

  const player = useAudioPlayer(
    nowPlaying?.audioUrl ? { uri: nowPlaying.audioUrl } : null,
  );

  const fetchAudioAsLocalFile = async (
    desc: string,
  ): Promise<string | null> => {
    try {
      const baseUrl =
        process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api";

      const destination = new File(Paths.cache, `audio_${Date.now()}.mp3`);

      const output = await File.downloadFileAsync(
        `${baseUrl}/tts/?text=${encodeURIComponent(desc)}`,
        destination,
      );

      if (!output.exists) return null;
      return output.uri;
    } catch (err) {
      console.warn("Failed to fetch audio:", err);
      return null;
    }
  };

  // Auto-play when nowPlaying changes
  useEffect(() => {
    if (nowPlaying?.audioUrl) {
      player.play();
    }
  }, [nowPlaying?.audioUrl]);

  const [triggerSubmit, { data, isLoading: isSubmitting }] =
    useLazySubmitLocationQuery();
  const [triggerDescSubmit] = useLazyGetPOIsDescQuery();

  useEffect(() => {
    requestLocation();
  }, []);

  const boundingCircle = useMemo(() => {
    if (location.status !== "ready") return null;
    const radius = 1000;
    const center = getCircleCenter(location.coords, heading, radius);
    return { latitude: center.latitude, longitude: center.longitude, radius };
  }, [location, heading]);

  const handleScan = useCallback(async () => {
    if (!boundingCircle) return;

    const result = await triggerSubmit(boundingCircle);
    if (!result.data?.places?.length) return;

    const descResult = await triggerDescSubmit({
      name: result.data.places.map((place) => place.displayName),
    });

    if (!descResult.data?.places?.length) return;

    const mp3Results = await Promise.all(
      descResult.data.places.map(async (place: descPlaces) => {
        const audioUrl = await fetchAudioAsLocalFile(place.desc);
        return { name: place.name, audioUrl };
      }),
    );

    const audioMap: Record<string, string> = {};
    for (const { name, audioUrl } of mp3Results) {
      if (audioUrl) audioMap[name] = audioUrl;
    }
    setPoiAudioMap(audioMap);
  }, [boundingCircle, triggerSubmit, triggerDescSubmit]);

  const handlePlay = useCallback(
    (title: string, summary: string) => {
      const audioUrl = poiAudioMap[title];
      if (!audioUrl) return;

      // If tapping the same item that's already playing, stop it
      if (nowPlaying?.title === title) {
        player.pause();
        setNowPlaying(null);
        return;
      }

      setNowPlaying({ title, summary, audioUrl });
    },
    [poiAudioMap, nowPlaying, player],
  );

  const handleStopPlaying = useCallback(() => {
    player.pause();
    setNowPlaying(null);
  }, [player]);

  const requestLocation = async () => {
    setLocation({ status: "loading" });
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocation({ status: "denied" });
      return;
    }
    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setLocation({
      status: "ready",
      coords: {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      },
    });
  };

  const isAnyScanLoading = isSubmitting;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingTop: theme.spacing(1) + insets.top,
        },
        scrollView: { flex: 1 },
        scrollContent: {
          paddingHorizontal: theme.gutterPadding,
          gap: theme.spacing(1),
          paddingBottom: nowPlaying ? theme.spacing(12) : theme.spacing(4),
        },
        overlay: {
          ...StyleSheet.absoluteFillObject,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
          gap: theme.spacing(2),
        },
        deniedCard: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.round,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
          padding: theme.spacing(3),
          marginHorizontal: theme.spacing(4),
          gap: theme.spacing(1.5),
          alignItems: "center",
        },
        scanBtn: {
          height: 50,
          borderRadius: theme.borderRadius.fiftyPercent,
          backgroundColor: theme.colors.primary,
          paddingHorizontal: theme.spacing(3),
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: theme.spacing(1),
        },
        scanBtnDisabled: {
          backgroundColor: theme.colors.surfaceVariant,
          shadowOpacity: 0,
          elevation: 0,
        },
        topBar: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: theme.gutterPadding,
          paddingBottom: theme.spacing(2),
        },
        playerBar: {
          position: "absolute",
          bottom: insets.bottom + theme.spacing(1),
          left: theme.spacing(2),
          right: theme.spacing(2),
          backgroundColor: theme.colors.primary,
          borderRadius: theme.borderRadius.semiRound,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: theme.spacing(2),
          paddingVertical: theme.spacing(1.5),
          gap: theme.spacing(1.5),
        },
        playerBarTextContainer: { flex: 1, gap: 2 },
        playerBarTitle: { color: theme.colors.onPrimary, fontWeight: "700" },
        playerBarSubtitle: {
          color: `${theme.colors.onPrimary}99`,
          fontSize: 12,
        },
        playerBarIcon: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: `${theme.colors.onPrimary}20`,
          alignItems: "center",
          justifyContent: "center",
        },
        pulsingDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.colors.onPrimary,
        },
      }),
    [theme, insets, nowPlaying],
  );

  return (
    <View style={styles.container}>
      {location.status === "loading" && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Finding your location...
          </Text>
        </View>
      )}

      {location.status === "denied" && (
        <View style={styles.overlay}>
          <View style={styles.deniedCard}>
            <Text variant="titleMedium" style={{ textAlign: "center" }}>
              Location Access Denied
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              App needs your location to show your position on the map.
            </Text>
            <TouchableOpacity
              onPress={requestLocation}
              style={{
                marginTop: theme.spacing(1),
                backgroundColor: theme.colors.primary,
                paddingHorizontal: theme.spacing(3),
                paddingVertical: theme.spacing(1.25),
                borderRadius: theme.borderRadius.round,
              }}
            >
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.onPrimary }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.topBar}>
        <Text variant="headline">Your List</Text>
        {location.status === "ready" && (
          <TouchableOpacity
            style={[styles.scanBtn, isAnyScanLoading && styles.scanBtnDisabled]}
            onPress={handleScan}
            disabled={isAnyScanLoading}
          >
            {isAnyScanLoading ? (
              <ActivityIndicator size="small" color={theme.colors.onPrimary} />
            ) : (
              <Text
                style={{ color: theme.colors.onPrimary, fontWeight: "700" }}
              >
                Scan Area
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {data?.places.map((place, index) => (
          <POIListCard
            key={index}
            headerTitle={place.displayName}
            rating={place.rating}
            formattedAddress={place.formattedAddress}
            editorialSummary={place.editorialSummary}
            openNow={place.openNow}
            openingHours={place.weeklyDescriptions}
            lat={place.latitude}
            lng={place.longitude}
            hasAudio={!!poiAudioMap[place.displayName]}
            isPlaying={nowPlaying?.title === place.displayName}
            onPress={(poi) => setSelectedPOI(poi)}
            onPlay={handlePlay}
          />
        ))}
      </ScrollView>

      <POIDrawer
        poi={selectedPOI}
        isOpen={selectedPOI !== null}
        onClose={() => setSelectedPOI(null)}
      />

      {nowPlaying && (
        <TouchableOpacity
          style={styles.playerBar}
          activeOpacity={0.9}
          onPress={handleStopPlaying}
        >
          <View style={styles.pulsingDot} />
          <View style={styles.playerBarTextContainer}>
            <Text style={styles.playerBarTitle} numberOfLines={1}>
              {nowPlaying.title}
            </Text>
            <Text style={styles.playerBarSubtitle} numberOfLines={1}>
              {nowPlaying.summary || "Playing audio guide..."}
            </Text>
          </View>
          <View style={styles.playerBarIcon}>
            <Text style={{ color: theme.colors.onPrimary, fontSize: 14 }}>
              ■
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

type POIListCardProps = POIItem & {
  onPress: (poi: POIItem) => void;
  onPlay: (title: string, summary: string) => void;
  hasAudio: boolean;
  isPlaying: boolean;
};

export const POIListCard = ({
  onPress,
  onPlay,
  hasAudio,
  isPlaying,
  ...poi
}: POIListCardProps) => {
  const theme = useAppTheme();

  const handlePlay = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!hasAudio) return;
      onPlay(poi.headerTitle, poi.editorialSummary);
    },
    [poi.headerTitle, poi.editorialSummary, onPlay, hasAudio],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing(1.5),
          backgroundColor: isPlaying
            ? `${theme.colors.primary}18`
            : theme.colors.surface,
          borderRadius: theme.borderRadius.semiRound,
          borderWidth: 1,
          borderColor: isPlaying
            ? theme.colors.primary
            : theme.colors.outlineVariant,
          paddingHorizontal: theme.spacing(1.5),
          paddingVertical: theme.spacing(1.5),
        },
        textContainer: { flex: 1, gap: theme.spacing(0.5) },
        subtitle: { color: theme.colors.onSurfaceVariant },
        playBtn: {
          padding: theme.spacing(0.5),
          opacity: hasAudio ? 1 : 0.3,
        },
      }),
    [theme, hasAudio, isPlaying],
  );

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => onPress(poi)}
    >
      <TouchableOpacity
        style={styles.playBtn}
        onPress={handlePlay}
        activeOpacity={hasAudio ? 0.7 : 1}
        disabled={!hasAudio}
      >
        <PlayIcon
          size="xLarge"
          color={isPlaying ? theme.colors.primary : undefined}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text variant="titleLarge">{poi.headerTitle}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {poi.editorialSummary || poi.formattedAddress}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

type POIDrawerProps = {
  poi: POIItem | null;
  isOpen: boolean;
  onClose: () => void;
};

const POIDrawer = ({ poi, isOpen, onClose }: POIDrawerProps) => {
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        content: {
          paddingTop: theme.spacing(2),
          gap: theme.spacing(2),
          paddingBottom: theme.spacing(2),
        },
        topRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: poi?.rating ? "space-between" : "flex-end",
        },
        ratingContainer: {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing(0.75),
          backgroundColor: theme.colors.surfaceVariant,
          paddingHorizontal: theme.spacing(1.5),
          paddingVertical: theme.spacing(0.75),
          borderRadius: theme.borderRadius.round,
        },
        summaryCard: {
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: theme.borderRadius.semiRound,
          padding: theme.spacing(2),
        },
        summaryText: {
          color: theme.colors.onSurfaceVariant,
          lineHeight: 22,
          letterSpacing: 1.5,
        },
        addressRow: { padding: theme.spacing(1.5) },
        addressText: { color: theme.colors.onSurfaceVariant },
        divider: { height: 1, backgroundColor: theme.colors.outlineVariant },
        hoursTitle: {
          color: theme.colors.onSurface,
          marginBottom: theme.spacing(1),
        },
        hoursContainer: { gap: theme.spacing(0.75) },
        hourRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: theme.spacing(2),
        },
        dayText: { color: theme.colors.onSurfaceVariant, flex: 1 },
        timeText: { color: theme.colors.onSurface, textAlign: "right" },
        chipText: {
          color: poi?.openNow ? theme.colors.onSecondary : theme.colors.onError,
          backgroundColor: poi?.openNow
            ? theme.colors.secondary
            : theme.colors.error,
          borderRadius: theme.borderRadius.round,
          paddingHorizontal: theme.spacing(1.5),
          paddingVertical: theme.spacing(0.5),
          overflow: "hidden",
        },
      }),
    [theme, poi?.openNow, poi?.rating],
  );

  if (!poi) return null;

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      headerTitle={poi.headerTitle}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          {poi.rating && (
            <View style={styles.ratingContainer}>
              <StarIcon size="medium" color={theme.colors.primary} />
              <Text variant="titleMedium">{poi.rating.toFixed(1)}</Text>
            </View>
          )}
          <Text style={styles.chipText}>
            {poi.openNow ? "Open Now" : "Closed"}
          </Text>
        </View>

        {poi.lat && poi.lng && <POIMapPreview lat={poi.lat} lng={poi.lng} />}

        {poi.editorialSummary ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{poi.editorialSummary}</Text>
          </View>
        ) : null}

        {poi.formattedAddress ? (
          <View style={styles.addressRow}>
            <Text style={styles.addressText}>{poi.formattedAddress}</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        {poi.openingHours && poi.openingHours.length > 0 && (
          <View>
            <Text variant="titleSmall" style={styles.hoursTitle}>
              Opening Hours
            </Text>
            <View style={styles.hoursContainer}>
              {poi.openingHours.map((hour, i) => {
                const [day, ...rest] = hour.split(": ");
                return (
                  <View key={i} style={styles.hourRow}>
                    <Text variant="bodySmall" style={styles.dayText}>
                      {day}
                    </Text>
                    <Text variant="bodySmall" style={styles.timeText}>
                      {rest.join(": ")}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </BottomDrawer>
  );
};

const POIMapPreview = ({ lat, lng }: { lat: number; lng: number }) => {
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          height: 160,
          borderRadius: theme.borderRadius.semiRound,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
        },
        map: { flex: 1 },
        markerOuter: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: `${theme.colors.primary}30`,
          alignItems: "center",
          justifyContent: "center",
        },
        markerInner: {
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: theme.colors.primary,
          borderWidth: 2.5,
          borderColor: theme.colors.onPrimary,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        showsCompass={false}
        showsScale={false}
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
        >
          <View style={styles.markerOuter}>
            <View style={styles.markerInner} />
          </View>
        </Marker>
      </MapView>
    </View>
  );
};
