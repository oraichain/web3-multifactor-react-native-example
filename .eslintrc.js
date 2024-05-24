module.exports = {
  root: true,
  extends: "@react-native",
  rules: {
    "avoidEscape": true,
    "allowTemplateLiterals": true
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
    },
  ],
};
