import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CityMap from '../components/CityMap/CityMap';
import Header from '../components/Header/Header';
import IconButton from '../components/IconButton/IconButton';
import PostCard from '../components/PostCard/PostCard';
import { styles } from '../styles/home';
import type { Post } from '../types/post';

const initialPosts: Post[] = [
  {
    id: 'barcelona',
    image: require('../../assets/images/tabIcons/PostOne.jpg'),
    mapCenter: { city: 'Barcelona', latitude: 41.3874, longitude: 2.1686 },
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
    image: require('../../assets/images/tabIcons/PostTwo.jpg'),
    mapCenter: { city: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
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

export default function HomeScreen() {
  const [posts, setPosts] = useState(initialPosts);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
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
      mapCenter: null,
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
        <Header
          searchOpen={searchOpen}
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onToggleSearch={() => {
            setSearchOpen((open) => !open);
            setSearchText('');
          }}
          onCreateList={() => openPostModal('create')}
        />

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
                onLike={() => toggleItem(post.id, setLikedPosts)}
                onSave={() => toggleItem(post.id, setSavedPosts)}
                onComments={() => openPostModal('comments', post)}
                onMap={() => openPostModal('map', post)}
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
          <IconButton
            label="Explore map"
            symbol={{ ios: 'map.fill', android: 'map', web: 'map' }}
            onPress={() => openPostModal('map', posts[0])}
          />
          <IconButton
            label="Top lists"
            symbol={{ ios: 'star.fill', android: 'star', web: 'star' }}
            active={activeTab === 'top'}
            onPress={() => setActiveTab('top')}
          />
          <IconButton
            label="Home feed"
            symbol={{ ios: 'house.fill', android: 'home', web: 'home' }}
            active={activeTab === 'home'}
            onPress={() => setActiveTab('home')}
          />
          <IconButton
            label="Saved lists"
            symbol={{ ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }}
            active={activeTab === 'saved'}
            onPress={() => setActiveTab('saved')}
          />
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
                <CityMap center={selectedPost.mapCenter} style={styles.modalMap} />
                <Text style={styles.modalFootnote}>
                  {selectedPost.mapCenter
                    ? `${selectedPost.mapCenter.city} city overview · Venue pins aren't available yet`
                    : 'Add a city location to preview this guide'}
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
