const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    port: 3000,
  },
  output: {
    publicPath: "auto",
  },
  plugins: [
    new ModuleFederationPlugin({
        name: "myAcademy", // 👈 must match the host's remote name
        filename: "remoteEntry.js",
        exposes: {
          "./HelloWorld": "./app/page", // exposed component
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
        },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
