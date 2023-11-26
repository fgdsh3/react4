import { Configuration } from "webpack";
import { BuildOptions } from "./types/types";
import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

export function buildPlugins(options: BuildOptions): Configuration['plugins'] {

  const isDev = options.mode === 'development'
  const isProd = options.mode === 'production'
  const plugins: Configuration['plugins'] = [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, '../../public', 'index.html') }),
  ]

  if (isDev) {
    plugins.push(new ESLintWebpackPlugin({
      overrideConfigFile: path.resolve(__dirname, '../../.eslintrc.json'),
    }))
  }

  if (isProd) {
    plugins.push(new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css'
    }))
  }

  return plugins
}