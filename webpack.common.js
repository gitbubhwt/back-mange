const path = require("path");

const webpack = require("webpack");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const pkg = require("./package.json");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    app: "./src/index.js",
    vendor: ["react", "react-dom", "antd"]
  },
  output: {
    //  <!-- 指定打包后的文件名字 -->
    // filename:"bundle.js",
    //开发模式下devserver有开启热替换，不能使用chunkhash
    filename: isProd ? "[name].[chunkhash].bundle.js" : "[name].bundle.js",
    chunkFilename: isProd ? "[name].[chunkhash].bundle.js" : "[name].bundle.js",
    // <!-- 打包后的文件路径 -->
    path: path.resolve(__dirname, "build"),
    sourceMapFilename: isProd ? "[name].[chunkhash].map" : "[name].map",
    // <!-- 资源文件 -->
    publicPath: "/"
  },
  module: {
    rules: [
      //js文件解析
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "env",
                {
                  targets: {
                    browsers: ["last 2 versions", "Firefox ESR"]
                  }
                }
              ],
              "stage-2",
              "react"
            ],
            // plugins: ["import"]
            plugins: [
              [
                "import",
                [
                  {
                    libraryName: "antd",
                    style: true
                  }
                ]
              ] // `style: true` 会加载 less 文件
            ]
            // plugins: []
          }
        }
      },
      //样式文件解析
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          }
        ]
        // exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
              modifyVars: {
                "primary-color": "#40aefc"
              }
            }
          }
        ]
        // exclude: /(node_modules|bower_components)/
      },
      //图片文件解析
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["url-loader?limit=10000&name=img/[name].[hash].[ext]"],
        exclude: /(node_modules|bower_components)/
      },
      //字体文件解析
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader?name=css/[name].[hash]"],
        exclude: /(node_modules|bower_components)/
      },
      //读取html，是html中引用的静态资源能被webpack加载到
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader"
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["build"]),
    //复制你的静态页面到指定位置
    new HtmlWebpackPlugin({
      title: "首页",
      // <!-- 指定模板位置 -->
      template: "./src/index.html",
      // <!-- 指定打包后的文件名字 -->
      filename: "index.html"
    }),

    //产生一个Manifest.json
    new ManifestPlugin(),
    //复制指定文件
    new CopyWebpackPlugin([
      {
        from: "./src/static",
        to: "./static"
      }
    ]),
    //通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存起来到缓存中供后续使用。
    //将你的代码拆分成第三方公共代码和应用代码。
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity
      // 随着 entrie chunk 越来越多，
      // 这个配置保证没其它的模块会打包进 vendor chunk
    }),
    // webpack 的样板(boilerplate)和 manifest 提取出来
    // 注意与vendor的顺序
    new webpack.optimize.CommonsChunkPlugin({
      name: "runtime"
    })
    //  new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./dist/vendors-manifest.json')
    // })
  ],
  resolve: {
    //设置软链接
    alias: {
      Static: path.resolve(__dirname, "./src/static/"),
      Ajax: path.resolve(__dirname, "./src/utils/ajax"),
      Utils: path.resolve(__dirname, "./src/utils"),
      Constants: path.resolve(__dirname, "./src/constants"),
      // 'Actions': path.resolve(__dirname, './src/actions'),
      Components: path.resolve(__dirname, "./src/components")
    }
  }
};
