const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

if (!googleMapsApiKey) {
  throw new Error('Set GOOGLE_MAPS_API_KEY before starting or building the app. See README.md.');
}

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    [
      'react-native-maps',
      {
        androidGoogleMapsApiKey: googleMapsApiKey,
      },
    ],
  ],
});
