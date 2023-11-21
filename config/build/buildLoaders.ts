import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ModuleOptions } from "webpack";
import { BuildOptions } from "./types/types";

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {

  const isDev = options.mode === 'development';

  const assetLoader = {
    test: /\.(png|jpe?g|gif|)$/i,
    type: 'asset/resource',
  }

  const svgrLoader = {
    test: /\.svg$/,
    use: ['@svgr/webpack']
  }

  const scssLoader = {
    test: /\.s[ac]ss$/,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
      'sass-loader',
    ],
  }

  const tsLoader = {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  }

  return [
    assetLoader,
    scssLoader,
    tsLoader,
    svgrLoader
  ]
}