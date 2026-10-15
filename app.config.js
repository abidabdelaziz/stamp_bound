const fs = require('node:fs');
const path = require('node:path');

const localEnvPath = path.join(__dirname, '.env.local');
if (fs.existsSync(localEnvPath)) {
  process.loadEnvFile(localEnvPath);
}

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
