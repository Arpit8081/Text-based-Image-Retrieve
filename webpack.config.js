// This file requires builds the project.
// Webpack transforms the front-end assets like HTML,CSS, and image. 
const webpack = require("webpack");
const path = require("path");
// HtmlWebpackPlugin - This plugin will generate an HTML file which includes all the webpack bundles in the body using script tags.
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: __dirname + "/src/Image_retrieve.js",
    output: {
        // creates a folder to save the files.
        path: __dirname + "/apple",
        // All the script data will be saved in Bundle.js file.
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                // Loads all the css files.
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                // finds the images and displays.
                test: /\.(png|jpe?g|gif|jpg)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            mimetype: "image/png"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin(
            [
                {
                    // This function copies all the image files to given folder. 
                    from: path.join(__dirname, "./src/images"),
                    test: /([^/]+)\/(.+)\.png$/,
                    to: __dirname + "/apple/images",
                    toType: "dir",
                    force: true,
                    copyUnmodified: true
                }
            ],
            { debug: true }
        ),
        new HtmlWebpackPlugin({ template: "Image_retrieve.html" }),
        new ExtractTextPlugin("styles.css")
    ]
};
