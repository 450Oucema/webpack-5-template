const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require("fs");
const port = process.env.PORT || 3000;

let pages = [];

const fileNames = fs.readdirSync('./public/');

fileNames.forEach(function (fileName, index) {
  pages.push(fileName.replace(/\.[^/.]+$/, ""));
})

module.exports = {
  mode: "development",
  entry: pages.reduce((config, page) => {
    config[page] = `./src/${page}.js`;
    return config;
  }, {}),
  output: {
    filename: "[name].bundle.[fullhash].js"
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localsConvention: 'camelCase',
              sourceMap: true
            }
          },
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],

      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  },
  plugins: [].concat(
      pages.map(
          (page) =>
            new HtmlWebpackPlugin({
              inject: true,
              template: `./public/${page}.html`,
              filename: `${page}.html`,
              chunks: [page]
            })
      ),
      // other plugins
  ),
};
