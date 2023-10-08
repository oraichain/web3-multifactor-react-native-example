const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");
const metroDefault = require("metro-config/src/defaults/defaults");
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      crypto: path.resolve(__dirname, "./crypto"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      url: require.resolve("url"),
      zlib: require.resolve("browserify-zlib"),
      // buffer: path.resolve(__dirname, "./node_modules/buffer"),
    },
    assetExts: metroDefault.assetExts.concat(["wasm"]),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
