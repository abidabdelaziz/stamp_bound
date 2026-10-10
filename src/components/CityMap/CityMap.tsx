import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import MapView from 'react-native-maps';
import { styles } from '../../styles/home';
import type { Post } from '../../types/post';

type CityMapProps = {
  center: Post['mapCenter'];
  style?: StyleProp<ViewStyle>;
};

export default function CityMap({ center, style }: CityMapProps) {
  return (
    <View style={[styles.cityMap, style]}>
      {center ? (
        <>
          <MapView
            style={styles.cityMapSurface}
            initialRegion={{
              latitude: center.latitude,
              longitude: center.longitude,
              latitudeDelta: 0.12,
              longitudeDelta: 0.12,
            }}
            accessibilityLabel={`Map centered on ${center.city}`}
          />
          <View style={styles.cityMapCaption} pointerEvents="none">
            <Text style={styles.cityMapEyebrow}>CITY OVERVIEW</Text>
            <Text style={styles.cityMapName}>{center.city}</Text>
          </View>
        </>
      ) : (
        <View style={styles.cityMapEmpty}>
          <Text style={styles.cityMapEmptyTitle}>MAP LOCATION NOT SET</Text>
          <Text style={styles.cityMapEmptyText}>Add a city to preview this guide.</Text>
        </View>
      )}
    </View>
  );
}
