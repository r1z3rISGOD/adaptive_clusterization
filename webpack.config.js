const { resolve } = require('path');
const SRC_PATH = resolve(__dirname, 'src');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
    new HtmlWebpackPlugin({
        template: './public/index.html',
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
    })
];

module.exports = {
    entry: `${SRC_PATH}/index.js`,
    devtool: 'source-map',
    mode: "development",
    plugins,
    output: {
        path: resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[hash][ext][query]',
        clean: true
    },
    devServer: {
        hot: true,
        static: "./dist",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    },
                },
            },
            { test: /\.(html)$/, use: ['html-loader'] },
            {
                test: /\.(css)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource'
            }
        ]
    }
};
