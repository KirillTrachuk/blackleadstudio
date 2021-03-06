const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./webpack.helpers');

const sitemapData = require('./app/sitemap');

// eslint-disable-next-line prefer-destructuring
const pathResolve = helpers.pathResolve;

module.exports = envRaw => {
    const env = envRaw || {};

    const noClear = env.noclear !== undefined;
    const fullMinify = !!env.fullminify;
    const isProd = process.env.NODE_ENV === 'production';
    const hmr = env.hmr !== undefined;
    const BasePath = env.outputPath || 'dist/';
    const publicPath = env.public_path_override || '/app/themes/aimpoint/static/build/'; // /wp-content/themes/aimpoint/static/build/ --- public path for prod build

    const outputPathResolve = helpers.createPathResolve(BasePath);
    console.log('Webpack config options:', {
        publicPath,
        outputPath: outputPathResolve(),
        noClear,
        fullMinify,
        isProd,
    });

    const htmlBuilder = new helpers.HtmlBuilder(fullMinify);

    return {
        entry: {
            app: './app/js/main.js',
        },
        output: {
            publicPath: publicPath,
            path: outputPathResolve(),
            filename: 'scripts/' + (isProd ? '[name][hash:6].js' : '[name].js'),
            chunkFilename: 'scripts/' + (isProd ? '[name][chunkhash:6][id].js' : '[name][id].js'),
        },
        resolve: {
            modules: [pathResolve('./app/js'), 'node_modules'],
            alias: {
                app: pathResolve('./app/js/'),
                assets: pathResolve('./app/assets/'),
                styles: pathResolve('./app/styles/'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.svgb$/,
                    loader: 'raw-loader',
                },
                {
                    test: /\.(html|ejs|php)$/,
                    loader: 'underscore-template-loader',
                    query: {
                        attributes: [
                            'img:src',
                            'x-img:src',
                            'object:data',
                            'source:src',
                            'img:data-src',
                            'source:data-src',
                            'source:data-srcset',
                            'link:href',
                            'source:srcset',
                            // 'div:data-bodymovin-path',
                        ],
                    },
                },

                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                    },
                    exclude: [/node_modules/, /dist/],
                },
                {
                    test: /\.(png|jpg|gif|webp|svg|ico)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'assets/img',
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[hash].[ext]',
                            outputPath: 'assets/fonts',
                        },
                    }],
                },
                {
                    test: /\.(webm|mp4|ogv)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/video',
                        },
                    }],
                },
                // {
                //     test: /\.json$/,
                //     type: 'javascript/auto',
                //     use: [{
                //         loader: 'file-loader',
                //         options: {
                //             name: '[name].[ext]',
                //             outputPath: (url, resourcePath, context) => {
                //                 const split = resourcePath.split('/');
                //                 const page = split[split.length - 3];
                //                 const section = split[split.length - 2];
                //                 return `assets/bodymovin/${page}/${section}/${url}`;
                //             },
                //         },
                //     }],
                // },
                {
                    test: /\.css$|\.sass$|\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: { hmr },
                        },
                        'css-loader', 'postcss-loader', 'sass-loader',
                    ],
                },
                {
                    test: /\.glsl$/,
                    use: 'raw-loader',
                },
                {
                    test: /browserconfig\.xml$|\.webmanifest/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets',
                        },
                    }],
                },
            ],
        },
        plugins: helpers.wrapPlugins([
            {
                name: 'clean',
                plugin: new CleanWebpackPlugin(),
                enabled: !noClear,
            },

            new webpack.DefinePlugin({
                process: {
                    env: {
                        NODE_ENV: JSON.stringify(
                            process.env.NODE_ENV || 'development',
                        ),
                        HOSTNAME: JSON.stringify(
                            process.env.HOSTNAME || 'http://localhost',
                        ),
                        PUBLIC_PATH_OVERRIDE: JSON.stringify(
                            publicPath,
                        ),
                    },
                },
            }),

            ...sitemapData.pagesFlatten.map(p => htmlBuilder.createHtmlPlugin(p.output, p.templateName, { page: p })),

            new MiniCssExtractPlugin({
                filename: 'styles/' + (isProd ? '[name][hash:6].css' : '[name].css'),
                chunkFilename: 'styles/' + (isProd ? '[hash:6][id].css' : '[name][id].css'),
            }),

            {
                name: 'minify',
                plugin: new MinifyPlugin({}, { comments: false }),
                enabled: fullMinify,
            },

            {
                name: 'minifycss',
                plugin: new OptimizeCssAssetsPlugin(),
                enabled: fullMinify,
            },
            // new CopyWebpackPlugin([
            //     { from: './app/bodymovin/', to: 'assets/bodymovin/', ignore: ['*.json'] },
            // ]),
        ]),
        devServer: {
            contentBase: outputPathResolve(),
            compress: true,
            port: 8080,
            staticOptions: {
                extensions: [
                    'html',
                ],
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    };
};
