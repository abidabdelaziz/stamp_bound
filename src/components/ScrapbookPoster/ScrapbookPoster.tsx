import { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '../../styles/home';
import type { Post } from '../../types/post';
import CityMap from '../CityMap/CityMap';

type ScrapbookPosterProps = {
  post: Post;
};

export default function ScrapbookPoster({ post }: ScrapbookPosterProps) {
  const pagerRef = useRef<ScrollView>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [activePage, setActivePage] = useState(0);

  return (
    <>
      <View
        style={styles.posterPager}
        onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}>
        {pageWidth > 0 && (
          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              setActivePage(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
            }}
            accessibilityLabel="Postcard pages">
            <Image
              source={post.image}
              style={[styles.poster, { width: pageWidth, height: '100%' }]}
              resizeMode="cover"
              accessibilityLabel={`${post.title.replace('\n', ' ')} post artwork`}
            />
            <View style={[styles.poster, styles.postDetails, { width: pageWidth, height: '100%' }]}>
              <Text style={styles.postDetailsEyebrow}>A LITTLE CITY GUIDE</Text>
              <Text style={styles.postDetailsTitle}>{post.title.replace('\n', ' ')}</Text>
              <CityMap center={post.mapCenter} style={styles.posterMap} />
              <Text style={styles.postDetailsSection}>PLACES TO SAVE</Text>
              {post.places.map((place, index) => (
                <View key={`${place}-${index}`} style={styles.postDetailsPlace}>
                  <Text style={styles.postDetailsNumber}>{String(index + 1).padStart(2, '0')}</Text>
                  <Text style={styles.postDetailsPlaceName}>{place}</Text>
                </View>
              ))}
              <Text style={styles.postDetailsDescription}>{post.description}</Text>
            </View>
          </ScrollView>
        )}
      </View>
      <View style={styles.posterPagination} accessibilityLabel={`Page ${activePage + 1} of 2`}>
        {[0, 1].map((page) => (
          <Pressable
            key={page}
            accessibilityRole="button"
            accessibilityLabel={`Show postcard page ${page + 1}`}
            onPress={() => {
              pagerRef.current?.scrollTo({ x: page * pageWidth, animated: true });
            }}>
            <View style={[styles.posterDot, activePage === page && styles.posterDotActive]} />
          </Pressable>
        ))}
      </View>
    </>
  );
}
