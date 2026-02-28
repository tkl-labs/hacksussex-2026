import { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/theme";
import { Text } from "@concerns/atomics";

type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "ready"; coords: { latitude: number; longitude: number } };

export default function MapScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<LocationState>({ status: "idle" });

  useEffect(() => {
    requestLocation();
  }, []);

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

  const handleRecenter = () => {
    if (location.status !== "ready") return;
    mapRef.current?.animateToRegion(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600,
    );
  };

  const initialRegion: Region | undefined =
    location.status === "ready"
      ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : undefined;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        map: {
          flex: 1,
        },
        header: {
          position: "absolute",
          top: insets.top + theme.spacing(1.5),
          left: theme.spacing(2),
          right: theme.spacing(2),
          zIndex: 10,
        },
        headerCard: {
          borderRadius: theme.borderRadius.round,
          backgroundColor: `${theme.colors.surface}F0`,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
        },
        headerContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: theme.spacing(2.5),
          paddingVertical: theme.spacing(1.5),
        },
        headerLeft: {
          gap: 2,
        },
        statusDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
        },
        statusRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing(0.75),
        },
        recenterBtn: {
          position: "absolute",
          bottom: insets.bottom + theme.spacing(3),
          right: theme.spacing(2),
          width: 50,
          height: 50,
          borderRadius: theme.borderRadius.fiftyPercent,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
          alignItems: "center",
          justifyContent: "center",
        },
        recenterIcon: {
          fontSize: 20,
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
        customMarkerOuter: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: `${theme.colors.primary}30`,
          alignItems: "center",
          justifyContent: "center",
        },
        customMarkerInner: {
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: theme.colors.primary,
          borderWidth: 3,
          borderColor: theme.colors.onPrimary,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 6,
        },
      }),
    [theme, insets],
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
              App needs your location to show your position on the map. Please
              enable it in your device settings.
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

      {(location.status === "ready" || location.status === "idle") && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={
            initialRegion ?? {
              latitude: 51.5074,
              longitude: -0.1278,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }
          }
          showsCompass={false}
          showsScale={false}
          showsUserLocation={false}
          showsMyLocationButton={false}
        >
          {location.status === "ready" && (
            <Marker
              coordinate={location.coords}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View style={styles.customMarkerOuter}>
                <View style={styles.customMarkerInner} />
              </View>
            </Marker>
          )}
        </MapView>
      )}

      {location.status === "ready" && (
        <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter}>
          <Text style={styles.recenterIcon}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
