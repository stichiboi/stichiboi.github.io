const path = require('path');
const ASSET_PATH = process.env.ASSET_PATH || '';

module.exports = {
    mode: 'development',
    entry: {
        local: path.resolve(__dirname, './../src/local/index.ts')
    },

    output: {
        filename: '[name].bundle.js',
        publicPath: ASSET_PATH,
        path: path.resolve(__dirname, '..'),
    },
    resolve: {extensions: ['.tsx', '.ts', '.jsx', '.js']},
    target: 'node',
    module: {
        rules: [
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
                test: /\.ts$/,
                use: ['ts-loader']
            },
        ]
    }
};
