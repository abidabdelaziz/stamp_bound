import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../../styles/home';
import type { Post } from '../../types/post';
import IconButton from '../IconButton/IconButton';
import ScrapbookPoster from '../ScrapbookPoster/ScrapbookPoster';

type PostCardProps = {
  post: Post;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onComments: () => void;
  onMap: () => void;
};

export default function PostCard({
  post,
  liked,
  saved,
  onLike,
  onSave,
  onComments,
  onMap,
}: PostCardProps) {
  return (
    <View style={styles.postCard}>
      <View style={styles.postAuthor}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{post.avatar}</Text>
        </View>
        <Text style={styles.username}>{post.username}</Text>
        <Text style={styles.moreButton}>···</Text>
      </View>

      <ScrapbookPoster post={post} />

      <View style={styles.postActions}>
        <Pressable onPress={onLike} style={styles.actionGroup} accessibilityRole="button" accessibilityLabel="Rate this list">
          <Text style={[styles.actionIcon, liked && styles.likedIcon]}>★</Text>
          <Text style={styles.actionCount}>{liked ? '5.0' : post.rating}</Text>
        </Pressable>
        <Pressable onPress={onComments} style={styles.actionGroup} accessibilityRole="button" accessibilityLabel="Open comments">
          <SymbolView
            name={{ ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
            size={26}
            tintColor="#11100E"
          />
          <Text style={styles.actionCount}>{post.comments}</Text>
        </Pressable>
        <IconButton
          label={saved ? 'Remove saved list' : 'Save list'}
          symbol={{ ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }}
          onPress={onSave}
          active={saved}
        />
        <View style={styles.actionSpacer} />
        <IconButton
          label="Open map"
          symbol={{ ios: 'map.fill', android: 'map', web: 'map' }}
          onPress={onMap}
        />
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
