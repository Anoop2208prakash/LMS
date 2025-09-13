module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    [
      "@locator/babel-jsx/dist",
      {
        env: "development",
      },
    ],
  ],
};
