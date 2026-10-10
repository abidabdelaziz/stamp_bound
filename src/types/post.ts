import type { ImageSourcePropType } from 'react-native';

export type Post = {
  id: string;
  image: ImageSourcePropType;
  mapCenter: {
    city: string;
    latitude: number;
    longitude: number;
  } | null;
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
