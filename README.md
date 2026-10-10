# stamp_bound
Stampbound is a social travel app built around short, visual lists of up to five places. Each post combines a customizable scrapbook-style collage with an interactive map. People can scroll for inspiration, swipe to see the locations, and save individual places or the entire map.

# Development Notes

Node version : 24.21.0
Npm version : 11.19.0

## Google Maps setup

The Android map uses `GOOGLE_MAPS_API_KEY` at native build time. Create a `.env.local` file in the project root and set:

```sh
GOOGLE_MAPS_API_KEY=your-restricted-android-maps-key
```

The local env file is ignored by Git. For EAS builds, configure the same variable in the EAS environment used by the build. Enable the Maps SDK for Android and restrict the key to the app's Android package name and signing certificate SHA-1. Rebuild the native app after changing the key; iOS uses Apple Maps.


Newer versions of npm (versions 10 and 11) handle peer dependency conflicts with rigid strictness compared to older package managers.

The Issue: If you install a third-party community React Native package that hasn't updated its internal version metadata file to explicitly list support for the newest React versions, npm might block the install and throw an ERESOLVE unable to resolve dependency tree error.

The Fix: Whenever installing standard packages, use the Expo safety wrapper which automatically matches compatible versions,
this will help to relay the app build via the secure expo proxy tunnel. 

npx expo install name-of-package

Instead of using npm start, explicitly let the bundler know to spin up a tunnel network interface. 

npx expo start --tunnel

If running on Chrostini Linux use : 

NODE_OPTIONS="--max-old-space-size=2048" WATCHMAN_FILTER_NODE_MODULES=1 npx expo start --web



## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
