const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const ASSET_PATH = process.env.ASSET_PATH || '';

module.exports = {
    entry: {
        index: path.resolve(__dirname, './../src/index.js')
    },

    output: {
        filename: '[name].bundle.js',
        publicPath: ASSET_PATH,
        path: path.resolve(__dirname, '..'),
    },
    resolve: {extensions: ['.tsx', '.ts', '.jsx', '.js']},

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {importLoaders: 1},
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    postcssPresetEnv
                                ],
                            },
                        }
                    }
                ],
            },
            {
                test: /\.(png|jpg|gif|webp|zip)$/,
                use: {
                    //Use file-loader rather than url-loader because
                    // inline svg don't display in older versions of Adobe CEP (17.1.3 and earlier)
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets'
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                loader: '@svgr/webpack'
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(ts|tsx)$/,
                use: ['babel-loader']
            },
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            title: 'Main UI',
            filename: 'index.html',
            template: path.resolve(__dirname, './../src/index.html'),
            inlineSource: '.(js)$',
            chunks: ['index', 'visuals']
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, '../src/icons/favicon.svg'),
            prefix: 'favicons/'
        })
    ]
};
