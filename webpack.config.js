const path = require("path");

module.exports = {
  mode: "development", // Or 'production'
  entry: "./src/index.ts", // Adjust if your entry file is different
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./public/dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"], // Add '.js' and '.jsx' if needed
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  // Add other configurations (e.g., devServer) here
};
