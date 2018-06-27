var path = require('path');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: {
        main: ['babel-polyfill','./src/app-client.js', hotMiddlewareScript]
    },
    output: {
        path: '/dist',
        publicPath: '/dist',
        filename: 'build.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ["es2015", "react", "stage-2"],
                plugins: ["transform-class-properties", "transform-decorators-legacy"]
            }
        }, {
            test: /\.css$/,
            loaders: [ 'style-loader', 'css-loader' ]
        }, {
            test: /\.(jpe?g|gif|png)$/,
            loader: 'file-loader?emitFile=false&name=[path][name].[ext]'
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            loader: "file-loader"
        },{
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            mangle: true,
            sourcemap: false,
            beautify: false,
            dead_code: true
        })
    ],
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
