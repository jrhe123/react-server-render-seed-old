const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
      main: ['babel-polyfill','./src/app-client.js']
    },
    output: {
       path: path.join(__dirname, '../src', 'static', 'js'),
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
            'process.env.NODE_ENV': JSON.stringify("production")
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            mangle: true,
            sourcemap: false,
            beautify: false,
            dead_code: true
        })
    ]
};
