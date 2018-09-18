module.exports = {
    entry: './src/SimpleMonads.js',
    output: {
        filename: 'lib/simple-monads.js',
        libraryTarget: "umd",
        library: "SimpleMonads"
    },
    node: {
        global: false
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
//                include: [/src/, /helpers/],
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
//    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
//        "jquery": "jQuery"
//    }
};
