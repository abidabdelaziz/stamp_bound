import { Text, View } from 'react-native';
import { styles } from '../../styles/home';

export default function BrandMark() {
  return (
    <View style={styles.brandMark}>
      <Text style={styles.brandText}>STAMP{'\n'}BOUND</Text>
    </View>
  );
}
