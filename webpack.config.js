const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.js',
    plugins: [
        new HtmlWebpackPlugin({ title: 'GAME' }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            require('@babel/plugin-proposal-class-properties'),
                            require('@babel/plugin-proposal-object-rest-spread'),
                            require('@babel/plugin-syntax-dynamic-import'),
                        ],
                    },
                },
            },
        ],
    },
};
