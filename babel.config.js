module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "react-native-dotenv",
      },
    ],
    [
      "module-resolver",
      {
        alias: {
          // "bn.js": "react-native-bignumber",
        },
      },
    ],
  ],
};
