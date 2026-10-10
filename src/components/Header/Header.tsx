import { SymbolView } from 'expo-symbols';
import { TextInput, View } from 'react-native';
import { styles } from '../../styles/home';
import BrandMark from '../BrandMark/BrandMark';
import IconButton from '../IconButton/IconButton';

type HeaderProps = {
  searchOpen: boolean;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onToggleSearch: () => void;
  onCreateList: () => void;
};

export default function Header({
  searchOpen,
  searchText,
  onSearchTextChange,
  onToggleSearch,
  onCreateList,
}: HeaderProps) {
  return (
    <>
      <View style={styles.header}>
        <IconButton
          label={searchOpen ? 'Close search' : 'Search lists'}
          symbol={
            searchOpen
              ? { ios: 'xmark', android: 'close', web: 'close' }
              : { ios: 'magnifyingglass', android: 'search', web: 'search' }
          }
          onPress={onToggleSearch}
        />
        <BrandMark />
        <IconButton
          label="Create a list"
          symbol={{ ios: 'plus', android: 'add', web: 'add' }}
          onPress={onCreateList}
        />
      </View>

      {searchOpen && (
        <View style={styles.searchWrap}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={24}
            tintColor="#242019"
            style={styles.searchIcon}
          />
          <TextInput
            value={searchText}
            onChangeText={onSearchTextChange}
            placeholder="Search places, lists, people"
            placeholderTextColor="#8B8578"
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
          />
        </View>
      )}
    </>
  );
}
