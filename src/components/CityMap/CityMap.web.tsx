import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { styles } from '../../styles/home';
import type { Post } from '../../types/post';

type CityMapProps = {
  center: Post['mapCenter'];
  style?: StyleProp<ViewStyle>;
};

export default function CityMap({ center, style }: CityMapProps) {
  return (
    <View style={[styles.cityMap, styles.cityMapWeb, style]}>
      <Text style={styles.cityMapEyebrow}>CITY OVERVIEW</Text>
      <Text style={styles.cityMapName}>{center?.city ?? 'Map location not set'}</Text>
      <Text style={styles.cityMapEmptyText}>Interactive maps are available in the mobile app.</Text>
    </View>
  );
}
