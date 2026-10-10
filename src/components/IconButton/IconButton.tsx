import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable } from 'react-native';
import { styles } from '../../styles/home';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

type IconButtonProps = {
  label: string;
  symbol: SymbolName;
  onPress: () => void;
  active?: boolean;
};

export default function IconButton({
  label,
  symbol,
  onPress,
  active = false,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      <SymbolView
        name={symbol}
        size={30}
        tintColor={active ? '#C53D26' : '#11100E'}
      />
    </Pressable>
  );
}
