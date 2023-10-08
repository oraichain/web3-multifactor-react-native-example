module.exports = {
  root: true,
  extends: "@react-native",
  rules: {
    quotes: ["error", "double"],
    "prettier/prettier": ["error", { singleQuote: false }],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
    },
  ],
};
