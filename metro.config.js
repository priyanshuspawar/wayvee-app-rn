// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const {
    wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...sourceExts, 'svg'];
config.transformer.babelTransformerPath = require.resolve(
    'react-native-svg-transformer'
);
config.resolver.unstable_enablePackageExports = true
config.resolver.unstable_conditionNames = [
    'require',
    'react-native',
    'default',
]
config.resolver.resolveRequest = function packageExportsResolver(
    context,
    moduleImport,
    platform
  ) {
    // Use the browser version of the package for React Native
    if (moduleImport === "axios" || moduleImport.startsWith("axios/")) {
      return context.resolveRequest(
        {
          ...context,
          unstable_conditionNames: ["browser"],
        },
        moduleImport,
        platform
      );
    }
  
    // Fall back to normal resolution
    return context.resolveRequest(context, moduleImport, platform);
  };



module.exports = wrapWithReanimatedMetroConfig(
    withNativeWind(config, { input: './global.css' })
);
