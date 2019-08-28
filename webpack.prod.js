// const path = require("path");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const glob = require("glob");

// module.exports = {
//     entry: "./src/containers/index.js",
//   // entry: {
//   //   "bundle.js": glob.sync("src/?(js|css)/main.*.?(js|css)").map(f => path.resolve(__dirname, f)),
//   // },
//   output: {
//     path: path.resolve(__dirname, 'build'),
//     filename: "index.min.js",
//   },
//   module: {
//     rules: [
//         {
//             test: /\.(js|jsx|tsx|ts)$/,
//             loader: 'babel-loader?cacheDirectory',
//             include: path.resolve(__dirname, 'src'),
//             options: {
//                 presets: [
//                     ['@babel/preset-env', { modules: false }],
//                     '@babel/preset-react',
//                     '@babel/preset-typescript',
//                 ],
//                 plugins: [
//                     '@babel/plugin-transform-runtime',
//                     '@babel/plugin-syntax-dynamic-import',
//                     ['@babel/plugin-proposal-decorators', { legacy: true }],
//                     '@babel/plugin-syntax-async-generators',
//                     ['@babel/plugin-proposal-class-properties', { loose: false }],
//                     '@babel/plugin-proposal-object-rest-spread',
//                     'react-hot-loader/babel',
//                     'dynamic-import-webpack',
//                     ['import', { libraryName: 'antd', style: true }],
//                 ],
//             },
//             exclude: /node_modules/,
//         },
//         {
//             test: /\.(css|less)$/,
//             use: ['style-loader', 'css-loader', 'less-loader'],
//         },
//         {
//             test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
//             loader: 'url-loader',
//             options: {
//                 publicPath: './',
//                 name: 'fonts/[hash].[ext]',
//                 limit: 10000,
//             },
//         },
//     ],
//   },
//   // optimization: {
//   //       splitChunks: {
//   //           cacheGroups: {
//   //               vendor: {
//   //                   test: /node_modules/,
//   //                   chunks: 'initial',
//   //                   name: 'vendor',
//   //                   enforce: true,
//   //               },
//   //           },
//   //       },
//   //       noEmitOnErrors: true,
//   //   },
//     resolve: {
//         // Add `.ts` and `.tsx` as a resolvable extension.
//         extensions: ['.ts', '.tsx', '.js', 'jsx'],
//     },
//     node: {
//         net: 'empty',
//         fs: 'empty',
//         tls: 'empty',
//     },
// }

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const baseConfig = require('./webpack.common.js');

const pathsToClean = [
    'js',
];
const cleanOptions = {
    root: path.resolve(__dirname, 'public'),
    verbose: true,
};
const plugins = [
    // 로더들에게 옵션을 넣어주는 플러그인
    new webpack.LoaderOptionsPlugin({
        minimize: true,
    }),
    // index.html 로 의존성 파일들 inject해주는 플러그인
    new HtmlWebpackPlugin({
        filename: 'index.html',
        title: 'React Internal Editor',
    }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
];
module.exports = merge(baseConfig, {
    mode: 'production',
    entry: {
        vendor: [
            'react',
            'react-dom',
            'lodash',
            'fabric',
            'antd',
        ],
        app: ['@babel/polyfill', path.resolve(__dirname, 'src/app.js')],
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/[name].[chunkhash:16].js',
        chunkFilename: 'js/[id].[chunkhash:16].js',
        publicPath: './',
    },
    optimization: {
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    warnings: false,
                    compress: {
                        warnings: false,
                        unused: true, // tree shaking(export된 모듈 중 사용하지 않는 모듈은 포함하지않음)
                    },
                    ecma: 6,
                    mangle: true,
                    unused: true,
                },
                sourceMap: true,
            }),
        ],
    },
    plugins,
});
