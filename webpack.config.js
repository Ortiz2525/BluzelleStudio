const path = require('path');
const webpack = require('webpack');
const BeepPlugin = require('webpack-beep-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';
PROD && console.log('----------- Compiling for production ----------');


module.exports = {
    entry: {
        index: path.resolve('./src/index.js')
    },
    output: {
        path: path.resolve('./dist/generated/js'),
        filename: '[name].js'
    },
    devtool: PROD ? '' : 'inline-source-map',
    module: {
        rules: [{

                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            ['@babel/plugin-proposal-decorators',
                                {
                                    "legacy": true
                                }
                            ],
                            ['@babel/plugin-proposal-class-properties'],
                            ['@babel/plugin-proposal-export-namespace-from'],
                            ['@babel/plugin-proposal-function-sent'],
                            ['@babel/plugin-proposal-json-strings'],
                            ['@babel/plugin-proposal-numeric-separator'],
                            ['@babel/plugin-proposal-throw-expressions'],
                            ['@babel/plugin-syntax-dynamic-import'],
                            ['@babel/plugin-syntax-import-meta']
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader?sourceMap']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: 'url-loader'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        mimetype: 'application/font-woff'
                    }
                }
            },
            {
                test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: {
                    loader: "url-loader"
                }
            }
        ]
    },
    externals: {
        fs: "commonjs fs",
    },
    resolve: {
        symlinks: false,
        alias: {
            components: path.resolve('./src/components'),
            services: path.resolve('./src/services'),
            stores: path.resolve('./src/stores'),
            src: path.resolve('./src'),
            constants: path.resolve('./src/constants'),
            res: path.resolve('./dist')
        }
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './dist/index.html',
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            Fragment: ['react', 'Fragment'],

            BS: 'reactstrap',

            Component: ['react', 'Component'],

            LinkBtn: ['components/LinkBtn', 'default'],
            withParams: ['components/withParams', 'default'],

            Layout: 'react-layout-pane/lib/Layout',
            Fixed: 'react-layout-pane/lib/Fixed',
            Flex: 'react-layout-pane/lib/Flex',

            withRouter: ['react-router-dom/withRouter', 'default'],
            Link: ['react-router-dom/Link', 'default'],
            Route: ['react-router-dom/Route', 'default'],
            Switch: ['react-router-dom/Switch', 'default'],

            observable: ['mobx', 'observable'],
            extendObservable: ['mobx', 'extendObservable'],
            observer: ['mobx-react', 'observer'],
            autorun: ['mobx', 'autorun'],
            untracked: ['mobx', 'untracked'],
            computed: ['mobx', 'computed'],
            transaction: ['mobx', 'transaction'],
            action: ['mobx', 'action'],

            Session: [path.resolve('stores/SessionStore'), 'default'],

            sinon: 'sinon',

            '$j': 'jquery',

            Maybe: ['monet', 'Maybe'],
            Either: ['monet', 'Either'],

            ReflexContainer: ['react-reflex', 'ReflexContainer'],
            ReflexSplitter: ['react-reflex', 'ReflexSplitter'],
            ReflexElement: ['react-reflex', 'ReflexElement']
        }),
        new BeepPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};