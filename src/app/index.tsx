import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Post = {
  id: string;
  username: string;
  avatar: string;
  title: string;
  places: string[];
  rating: string;
  comments: number;
  description: string;
  date: string;
  colors: [string, string, string];
  collage: string[];
  stamp: string;
  stampColor: string;
};

const initialPosts: Post[] = [
  {
    id: 'barcelona',
    username: '@Foodiebloggerbabe',
    avatar: '👩🏽‍🍳',
    title: 'BARCELONA\nTAPAS',
    places: ['Bar Bocata', 'Vereda Bar', 'Paco Meralgo', 'Malparit', 'Bar del Pla'],
    rating: '4.9',
    comments: 12,
    description: 'After living in Barcelona for 5 years, these are my go-to tapas spots.',
    date: 'October 5, 2026',
    colors: ['#A8B02A', '#D76E36', '#B63B32'],
    collage: ['🫒', '🥘', '🍅'],
    stamp: 'LOCAL',
    stampColor: '#E23D25',
  },
  {
    id: 'tokyo',
    username: '@magiccarpetmaster',
    avatar: '🧑🏻‍🦱',
    title: 'TOKYO\nRAMEN SPOTS',
    places: ['Ganso Stamina', 'Rikido', 'Chukasoba Tomita', 'Hakata Nagahama', 'Shoten Ramen'],
    rating: '4.3',
    comments: 754,
    description: 'Insane ramen spots in Tokyo. Save this one for your next trip!',
    date: 'October 5, 2026',
    colors: ['#263A2C', '#C84631', '#E8B544'],
    collage: ['🍜', '🍥', '🥢'],
    stamp: 'THIS LIST IS HOT',
    stampColor: '#1779D0',
  },
];

type ModalContent = 'create' | 'comments' | 'map' | 'profile' | null;
type FeedTab = 'home' | 'top' | 'saved';

function BrandMark() {
  return (
    <View style={styles.brandMark}>
      <Text style={styles.brandText}>STAMP{'\n'}BOUND</Text>
    </View>
  );
}

function IconButton({
  label,
  icon,
  onPress,
  active = false,
}: {
  label: string;
  icon: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      <Text style={[styles.icon, active && styles.activeIcon]}>{icon}</Text>
    </Pressable>
  );
}

function ScrapbookPoster({ post, alternate }: { post: Post; alternate: boolean }) {
  const sideLetters = post.title.replace(/[^A-Z]/g, '').slice(0, 5).split('');

  return (
    <View style={[styles.poster, { backgroundColor: post.colors[0] }]}>
      <View style={[styles.posterLeftField, { backgroundColor: post.colors[1] }]} />
      <View style={[styles.posterRightField, { backgroundColor: post.colors[2] }]}>
        {Array.from({ length: 8 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.checkerTile,
              (index + Math.floor(index / 2)) % 2 === 0 && styles.checkerTileAlternate,
            ]}
          />
        ))}
      </View>
      <View style={styles.posterDecorationTop}>
        <Text style={styles.decorEmoji}>{alternate ? post.collage[2] : post.collage[1]}</Text>
        <Text style={styles.decorSparkle}>✳</Text>
      </View>
      <View style={styles.collagePhotoTop}>
        <Text style={styles.collagePhotoEmoji}>{post.collage[0]}</Text>
      </View>
      <View style={styles.collagePhotoBottom}>
        <Text style={styles.collagePhotoEmoji}>{alternate ? post.collage[1] : post.collage[2]}</Text>
      </View>
      <View style={styles.sideLetters}>
        {sideLetters.map((letter, index) => (
          <View key={`${letter}-${index}`} style={styles.letterToken}>
            <Text style={styles.letterTokenText}>{letter}</Text>
          </View>
        ))}
      </View>
      <View style={styles.paper}>
        <Text style={[styles.posterTitle, { color: post.id === 'tokyo' ? post.colors[1] : '#15120F' }]}>
          {post.title}
        </Text>
        <View style={styles.paperDivider} />
        {post.places.map((place, index) => (
          <Text key={place} numberOfLines={1} style={styles.placeLine}>
            <Text style={styles.placeNumber}>{index + 1}. </Text>
            {place}
          </Text>
        ))}
        <View style={[styles.stamp, { backgroundColor: post.stampColor }]}>
          <Text style={styles.stampText}>{post.stamp}</Text>
          <View style={styles.barcode} />
        </View>
      </View>
      <View style={styles.postageSticker}>
        <Text style={styles.postageEmoji}>{post.id === 'tokyo' ? '🗼' : '📍'}</Text>
        <Text style={styles.postageCaption}>{post.id === 'tokyo' ? 'TOKYO' : 'BCN'}</Text>
      </View>
      <View style={[styles.tape, { backgroundColor: post.colors[2] }]} />
    </View>
  );
}

function PostCard({
  post,
  liked,
  saved,
  alternate,
  onLike,
  onSave,
  onComments,
  onMap,
  onPage,
}: {
  post: Post;
  liked: boolean;
  saved: boolean;
  alternate: boolean;
  onLike: () => void;
  onSave: () => void;
  onComments: () => void;
  onMap: () => void;
  onPage: () => void;
}) {
  return (
    <View style={styles.postCard}>
      <View style={styles.postAuthor}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{post.avatar}</Text>
        </View>
        <Text style={styles.username}>{post.username}</Text>
        <Text style={styles.moreButton}>···</Text>
      </View>

      <ScrapbookPoster post={post} alternate={alternate} />

      <View style={styles.pagination}>
        <Pressable onPress={onPage} accessibilityLabel="Switch collage page">
          <View style={[styles.dot, !alternate && styles.dotActive]} />
        </Pressable>
        <Pressable onPress={onPage} accessibilityLabel="Switch collage page">
          <View style={[styles.dot, alternate && styles.dotActive]} />
        </Pressable>
      </View>

      <View style={styles.postActions}>
        <Pressable onPress={onLike} style={styles.actionGroup} accessibilityRole="button" accessibilityLabel="Rate this list">
          <Text style={[styles.actionIcon, liked && styles.likedIcon]}>★</Text>
          <Text style={styles.actionCount}>{liked ? '5.0' : post.rating}</Text>
        </Pressable>
        <Pressable onPress={onComments} style={styles.actionGroup} accessibilityRole="button" accessibilityLabel="Open comments">
          <Text style={styles.actionIcon}>●</Text>
          <Text style={styles.actionCount}>{post.comments}</Text>
        </Pressable>
        <IconButton label={saved ? 'Remove saved list' : 'Save list'} icon={saved ? '▣' : '▰'} onPress={onSave} active={saved} />
        <View style={styles.actionSpacer} />
        <IconButton label="Open map" icon="◧" onPress={onMap} />
      </View>

      <Text numberOfLines={2} style={styles.description}>
        <Text style={styles.username}>{post.username} </Text>
        {post.description}
        <Text style={styles.moreText}> more</Text>
      </Text>
      <Text style={styles.postDate}>{post.date}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [posts, setPosts] = useState(initialPosts);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [alternatePages, setAlternatePages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<FeedTab>('home');
  const [modal, setModal] = useState<ModalContent>(null);
  const [selectedPost, setSelectedPost] = useState<Post>(initialPosts[0]);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftPlaces, setDraftPlaces] = useState('');

  const visiblePosts = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${post.username} ${post.title} ${post.places.join(' ')}`.toLowerCase().includes(normalizedQuery);
      const matchesTab =
        activeTab === 'home' ||
        (activeTab === 'top' && Number(post.rating) >= 4.5) ||
        (activeTab === 'saved' && savedPosts.includes(post.id));
      return matchesQuery && matchesTab;
    });
  }, [activeTab, posts, savedPosts, searchText]);

  function toggleItem(id: string, update: Dispatch<SetStateAction<string[]>>) {
    update((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function createPost() {
    const title = draftTitle.trim();
    const places = draftPlaces
      .split(',')
      .map((place) => place.trim())
      .filter(Boolean)
      .slice(0, 5);
    if (!title || places.length === 0) {
      return;
    }

    const newPost: Post = {
      ...initialPosts[0],
      id: `local-${Date.now()}`,
      username: '@you',
      avatar: '🙂',
      title: title.toUpperCase(),
      places,
      rating: '0.0',
      comments: 0,
      description: 'Freshly stamped and ready to explore.',
      date: 'Just now',
      stamp: 'NEW',
    };
    setPosts((current) => [newPost, ...current]);
    setActiveTab('home');
    setDraftTitle('');
    setDraftPlaces('');
    setModal(null);
  }

  function openPostModal(content: Exclude<ModalContent, null>, post?: Post) {
    if (post) setSelectedPost(post);
    setModal(content);
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EFDF" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <IconButton
            label={searchOpen ? 'Close search' : 'Search lists'}
            icon={searchOpen ? '×' : '⌕'}
            onPress={() => {
              setSearchOpen((open) => !open);
              setSearchText('');
            }}
          />
          <BrandMark />
          <IconButton label="Create a list" icon="＋" onPress={() => openPostModal('create')} />
        </View>

        {searchOpen && (
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search places, lists, people"
              placeholderTextColor="#8B8578"
              style={styles.searchInput}
              autoFocus
              returnKeyType="search"
            />
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                liked={likedPosts.includes(post.id)}
                saved={savedPosts.includes(post.id)}
                alternate={alternatePages.includes(post.id)}
                onLike={() => toggleItem(post.id, setLikedPosts)}
                onSave={() => toggleItem(post.id, setSavedPosts)}
                onComments={() => openPostModal('comments', post)}
                onMap={() => openPostModal('map', post)}
                onPage={() => toggleItem(post.id, setAlternatePages)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStamp}>✳</Text>
              <Text style={styles.emptyTitle}>No stamps here yet</Text>
              <Text style={styles.emptyBody}>
                {activeTab === 'saved'
                  ? 'Save a list you love and it will show up here.'
                  : 'Try another search, or make the first list.'}
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <IconButton label="Explore map" icon="♧" onPress={() => openPostModal('map', posts[0])} />
          <IconButton label="Top lists" icon="★" active={activeTab === 'top'} onPress={() => setActiveTab('top')} />
          <IconButton label="Home feed" icon="⌂" active={activeTab === 'home'} onPress={() => setActiveTab('home')} />
          <IconButton label="Saved lists" icon="▰" active={activeTab === 'saved'} onPress={() => setActiveTab('saved')} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Your profile"
            onPress={() => openPostModal('profile')}
            style={({ pressed }) => [styles.avatar, styles.bottomAvatar, pressed && styles.pressed]}>
            <Text style={styles.avatarEmoji}>🙂</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal
        visible={modal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setModal(null)}>
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.backdropDismiss} onPress={() => setModal(null)} />
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {modal === 'create'
                  ? 'Make a new stamp'
                  : modal === 'comments'
                    ? 'The travel chatter'
                    : modal === 'map'
                      ? `${selectedPost.title.replace('\n', ' ')} map`
                      : 'Your passport'}
              </Text>
              <Pressable onPress={() => setModal(null)} accessibilityLabel="Close">
                <Text style={styles.closeButton}>×</Text>
              </Pressable>
            </View>

            {modal === 'create' ? (
              <View style={styles.form}>
                <Text style={styles.fieldLabel}>GIVE YOUR LIST A TITLE</Text>
                <TextInput
                  value={draftTitle}
                  onChangeText={setDraftTitle}
                  placeholder="e.g. Little cafés in Lisbon"
                  placeholderTextColor="#948C7D"
                  style={styles.formInput}
                  maxLength={40}
                />
                <Text style={styles.fieldLabel}>ADD UP TO FIVE PLACES, SEPARATED BY COMMAS</Text>
                <TextInput
                  value={draftPlaces}
                  onChangeText={setDraftPlaces}
                  placeholder="Café A, Bakery B, ..."
                  placeholderTextColor="#948C7D"
                  style={[styles.formInput, styles.placesInput]}
                  multiline
                />
                <Pressable
                  onPress={createPost}
                  accessibilityRole="button"
                  style={[styles.primaryButton, (!draftTitle.trim() || !draftPlaces.trim()) && styles.disabledButton]}>
                  <Text style={styles.primaryButtonText}>Stamp my list ✳</Text>
                </Pressable>
              </View>
            ) : modal === 'comments' ? (
              <View style={styles.modalContent}>
                <Text style={styles.commentCount}>{selectedPost.comments} fellow travelers left a note</Text>
                <View style={styles.commentCard}>
                  <Text style={styles.commentAvatar}>🧳</Text>
                  <Text style={styles.commentText}>
                    <Text style={styles.username}>@wanderoften </Text>
                    Adding this to my Barcelona itinerary!
                  </Text>
                </View>
                <TextInput
                  placeholder="Leave a little note..."
                  placeholderTextColor="#948C7D"
                  style={styles.commentInput}
                />
              </View>
            ) : modal === 'map' ? (
              <View style={styles.modalContent}>
                <View style={styles.mapPreview}>
                  <View style={styles.mapRoadOne} />
                  <View style={styles.mapRoadTwo} />
                  <Text style={[styles.mapPin, { top: '19%', left: '22%' }]}>📍</Text>
                  <Text style={[styles.mapPin, { top: '36%', left: '59%' }]}>📍</Text>
                  <Text style={[styles.mapPin, { top: '60%', left: '35%' }]}>📍</Text>
                  <Text style={[styles.mapPin, { top: '71%', left: '72%' }]}>📍</Text>
                  <Text style={styles.mapLabel}>YOUR LITTLE CITY GUIDE</Text>
                </View>
                <Text style={styles.modalFootnote}>
                  {selectedPost.places.length} saved stops · Map preview
                </Text>
              </View>
            ) : (
              <View style={styles.profileContent}>
                <View style={[styles.avatar, styles.profileAvatar]}>
                  <Text style={styles.avatarEmoji}>🙂</Text>
                </View>
                <Text style={styles.profileName}>Your travel scrapbook</Text>
                <Text style={styles.profileNote}>
                  Save your favorite lists and collect little places worth remembering.
                </Text>
                <Text style={styles.profileStats}>
                  {savedPosts.length} SAVED STAMPS     {posts.length} COMMUNITY LISTS
                </Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5EFDF',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  header: {
    minHeight: 84,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    minWidth: 42,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#11100E',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '500',
  },
  activeIcon: {
    color: '#C53D26',
  },
  pressed: {
    opacity: 0.55,
  },
  brandMark: {
    width: 98,
    height: 72,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#171511',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-1deg' }],
  },
  brandText: {
    color: '#11100E',
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 19,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  searchWrap: {
    height: 48,
    marginHorizontal: 22,
    marginBottom: 12,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#EAE2D0',
  },
  searchIcon: {
    fontSize: 27,
    color: '#242019',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1D1A15',
    paddingVertical: 8,
  },
  feed: {
    paddingHorizontal: 18,
    paddingBottom: 14,
    alignItems: 'center',
  },
  postCard: {
    width: '100%',
    marginBottom: 22,
  },
  postAuthor: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#60765D',
    backgroundColor: '#D5C8AE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 23,
  },
  username: {
    color: '#161410',
    fontWeight: '800',
    fontSize: 15,
  },
  moreButton: {
    marginLeft: 'auto',
    fontSize: 27,
    color: '#28241C',
    letterSpacing: 1,
    paddingHorizontal: 5,
  },
  poster: {
    width: '100%',
    aspectRatio: 0.84,
    maxHeight: 520,
    minHeight: 360,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#BBAF94',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterLeftField: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '24%',
  },
  posterRightField: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '25%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'stretch',
  },
  checkerTile: {
    width: '50%',
    height: '25%',
    backgroundColor: 'rgba(255, 242, 218, 0.2)',
  },
  checkerTileAlternate: {
    backgroundColor: 'rgba(35, 30, 22, 0.12)',
  },
  sideLetters: {
    position: 'absolute',
    zIndex: 3,
    left: '3%',
    top: '20%',
    gap: 5,
  },
  letterToken: {
    width: 38,
    height: 38,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#C8BFA9',
    backgroundColor: '#F8F2E4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#201A11',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  letterTokenText: {
    color: '#171511',
    fontSize: 20,
    fontWeight: '900',
  },
  collagePhotoTop: {
    position: 'absolute',
    left: '7%',
    top: '7%',
    width: 84,
    height: 106,
    borderColor: '#FFF9EB',
    borderWidth: 4,
    backgroundColor: '#E6CBA1',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-7deg' }],
    zIndex: 1,
  },
  collagePhotoBottom: {
    position: 'absolute',
    left: '6%',
    bottom: '5%',
    width: 98,
    height: 84,
    borderColor: '#FFF9EB',
    borderWidth: 4,
    backgroundColor: '#E7D6B8',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '8deg' }],
    zIndex: 1,
  },
  collagePhotoEmoji: {
    fontSize: 49,
  },
  posterDecorationTop: {
    position: 'absolute',
    top: '5%',
    left: '31%',
    right: '27%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  decorEmoji: {
    fontSize: 34,
  },
  decorSparkle: {
    color: '#F7ECD5',
    fontSize: 40,
  },
  paper: {
    zIndex: 2,
    width: '70%',
    minHeight: '64%',
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#F9F4E9',
    borderColor: '#D6CBB8',
    borderWidth: 1,
    shadowColor: '#261F16',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  posterTitle: {
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 21,
    lineHeight: 23,
    letterSpacing: 0.7,
    marginBottom: 7,
  },
  paperDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#8C8578',
    marginBottom: 5,
  },
  placeLine: {
    color: '#25221C',
    fontSize: 13,
    lineHeight: 22,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
    fontWeight: '700',
  },
  placeNumber: {
    fontWeight: '900',
  },
  stamp: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 96,
    marginTop: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: '#E23D25',
    transform: [{ rotate: '-2deg' }],
  },
  stampText: {
    color: '#FFF7E9',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  barcode: {
    width: 48,
    height: 9,
    marginTop: 2,
    backgroundColor: '#171511',
  },
  postageSticker: {
    position: 'absolute',
    zIndex: 3,
    bottom: '8%',
    right: '5%',
    width: 66,
    height: 76,
    backgroundColor: '#F6F0E0',
    borderWidth: 3,
    borderColor: '#FFF9EE',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '11deg' }],
  },
  postageEmoji: {
    fontSize: 31,
  },
  postageCaption: {
    fontSize: 10,
    fontWeight: '900',
    color: '#242019',
  },
  tape: {
    position: 'absolute',
    width: 90,
    height: 26,
    bottom: '5%',
    left: '6%',
    opacity: 0.85,
    transform: [{ rotate: '-8deg' }],
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 29,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#B9B5AC',
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4C9BD8',
  },
  postActions: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionGroup: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    color: '#11100E',
    fontSize: 31,
    lineHeight: 36,
  },
  likedIcon: {
    color: '#D3412B',
  },
  actionCount: {
    color: '#181611',
    fontSize: 17,
    fontWeight: '700',
  },
  actionSpacer: {
    flex: 1,
  },
  description: {
    marginTop: 2,
    color: '#2B281F',
    fontSize: 13,
    lineHeight: 19,
  },
  moreText: {
    color: '#766F61',
  },
  postDate: {
    marginTop: 3,
    fontSize: 11,
    color: '#81796C',
  },
  bottomBar: {
    minHeight: 62,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5EFDF',
    borderTopColor: '#E6DDCA',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bottomAvatar: {
    width: 39,
    height: 39,
  },
  emptyState: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
  },
  emptyStamp: {
    color: '#D14A30',
    fontSize: 47,
  },
  emptyTitle: {
    marginTop: 10,
    color: '#1B1812',
    fontSize: 21,
    fontWeight: '900',
  },
  emptyBody: {
    marginTop: 8,
    color: '#756D60',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(21, 18, 13, 0.38)',
  },
  backdropDismiss: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: '#F7F1E4',
    paddingTop: 10,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '82%',
  },
  sheetHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CCC2B0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sheetTitle: {
    flex: 1,
    color: '#1A1712',
    fontSize: 21,
    fontWeight: '900',
  },
  closeButton: {
    fontSize: 30,
    lineHeight: 31,
    color: '#28241D',
    paddingLeft: 14,
  },
  form: {
    gap: 10,
  },
  fieldLabel: {
    marginTop: 6,
    color: '#6E6659',
    fontSize: 10,
    letterSpacing: 1.1,
    fontWeight: '800',
  },
  formInput: {
    minHeight: 48,
    paddingHorizontal: 13,
    color: '#201C16',
    backgroundColor: '#EEE6D7',
    borderRadius: 10,
    fontSize: 15,
  },
  placesInput: {
    minHeight: 86,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  primaryButton: {
    minHeight: 50,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D7472D',
    borderRadius: 11,
  },
  disabledButton: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: '#FFF7E9',
    fontSize: 16,
    fontWeight: '900',
  },
  modalContent: {
    paddingBottom: 12,
  },
  commentCount: {
    color: '#71695D',
    marginBottom: 14,
    fontSize: 13,
  },
  commentCard: {
    flexDirection: 'row',
    gap: 10,
    padding: 13,
    backgroundColor: '#EEE6D7',
    borderRadius: 12,
  },
  commentAvatar: {
    fontSize: 23,
  },
  commentText: {
    flex: 1,
    color: '#28241C',
    fontSize: 14,
    lineHeight: 21,
  },
  commentInput: {
    minHeight: 46,
    marginTop: 14,
    paddingHorizontal: 13,
    borderRadius: 10,
    backgroundColor: '#EEE6D7',
    color: '#211E18',
  },
  mapPreview: {
    height: 260,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#D9DFBF',
    position: 'relative',
  },
  mapRoadOne: {
    position: 'absolute',
    width: '130%',
    height: 44,
    left: '-15%',
    top: '43%',
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderColor: '#F6F0E1',
    transform: [{ rotate: '-23deg' }],
  },
  mapRoadTwo: {
    position: 'absolute',
    width: '130%',
    height: 34,
    left: '-13%',
    top: '55%',
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#F6F0E1',
    transform: [{ rotate: '28deg' }],
  },
  mapPin: {
    position: 'absolute',
    fontSize: 24,
  },
  mapLabel: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: '#515944',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  modalFootnote: {
    marginTop: 12,
    color: '#6F685C',
    fontSize: 13,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileAvatar: {
    width: 76,
    height: 76,
    borderRadius: 40,
  },
  profileName: {
    marginTop: 12,
    color: '#1C1913',
    fontSize: 18,
    fontWeight: '900',
  },
  profileNote: {
    maxWidth: 270,
    marginTop: 7,
    color: '#71695D',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  profileStats: {
    marginTop: 18,
    color: '#D0472D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
});
