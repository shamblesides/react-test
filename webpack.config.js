const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StatsWebpackPlugin = require('stats-webpack-plugin');

module.exports = {
    entry: './index.js',
    plugins: [
        new HtmlWebpackPlugin({ title: 'GAME' }),
        new CleanWebpackPlugin(),
        new StatsWebpackPlugin('stats.json', {
            chunkModules: true
        })
    ],
    stats: {
        modules: false,
        entrypoints: false,
        version: false,
        children: false,
    },
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
                            require('@babel/plugin-syntax-dynamic-import'),
                        ],
                    },
                },
            },
        ],
    },
};
