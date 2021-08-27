const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '';

module.exports = {
    entry: {
        index: path.resolve(__dirname, './../src/index.js'),
        visuals: path.resolve(__dirname, './../src/visuals.js'),
    },

    output: {
        filename: '[name].bundle.js',
        publicPath: ASSET_PATH,
        path: path.resolve(__dirname, '../../dist/stichiclock'),
    },
    resolve: {extensions: ['.tsx', '.ts', '.jsx', '.js']},

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|webp|svg|zip)$/,
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
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.ts$/,
                use: ['ts-loader']
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
        // new CleanWebpackPlugin(),
    ]
};
