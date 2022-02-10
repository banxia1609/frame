
const path = require('path')

/** 引入uglifyjs-webpack-plugin */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/** 引入mini-css-extract-plugin */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// resolve辅助函数
function resolve (dir) {
  return path.join(__dirname, dir)
}

// 全局编译公共样式方案
function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/stylus/imports.styl'),
      ],
    })
}


module.exports = {
    runtimeCompiler: true, // Default: false 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
    publicPath: './', // 根路径 cli3.0以上使用publicPath替代baseUrzl,解决build后找不到静态资源的问题
    productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    lintOnSave: false, // process.env.NODE_ENV === 'development',//是否开启eslint保存检测 ,它的有效值为 true || false || 'error'
    outputDir: process.env.NODE_ENV === 'production' ? 'build' : 'devbuild', // 打包环境-文件输出的目录名
    productionSourceMap: false, //  是否产生map
    devServer: { 
        port: 8080, // 端口
        open: false, // 启动项目后自动开启浏览器
        overlay: {
          warnings: false,
          errors: false
        },
        // 请求代理
        // proxy: {
        //   '/api': {
        //     target: 'https://mircocloud.com.cn/',
        //     ws: false,
        //     changeOrigin: true,
        //     pathRewrite: {
        //       '/api': ''
        //     }
        //   },
        // }
    },
    // 基于环境有条件地配置行为
    configureWebpack: config => {
        // 线上版本
        if (process.env.NODE_ENV === 'production') {
          // 为生产环境修改配置
          config.mode = 'production';
          /** 移除console */
          config.optimization.minimizer.push(
            new UglifyJsPlugin({
              uglifyOptions: {
                warnings: false,
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log'] 
                }
              }
            })
          )
        } else {
          // 为开发环境修改配置
          config.mode = 'development'
        }

        Object.assign(config, {
          // 开发生产共同配置
          resolve: {
            extensions: ['.js', '.vue', '.json'],  // 引入时可省略扩展名
            alias: {                               // 自定义别名
              '@': path.resolve(__dirname, './src')
            }
          }
        })
        
    },
    // css相关配置
    css: {
      extract: false, // 是否使用css分离插件 ExtractTextPlugin (默认生产为true，开发为false)
      sourceMap: false, // 开启 CSS source maps?
      loaderOptions: {
        css: {}, // 这里的选项会传递给 css-loader 
      }, // css预设器配置项
      modules: false // 启用 CSS modules for all css / pre-processor files.
    },
    // 对webpack内部配置进行颗粒度的修改
    chainWebpack: config => {

        // 修复HRM 
        config.resolve.symlinks(true)

        // 打包代码分割
        config.optimization.splitChunks({
          chunks: "all",          //async异步代码分割 initial同步代码分割 all同步异步分割都开启
          minSize: 30000,         //字节 引入的文件大于30kb才进行分割
          //maxSize: 50000,         //50kb，尝试将大于50kb的文件拆分成n个50kb的文件
          minChunks: 1,           //模块至少使用次数
          maxAsyncRequests: 5,    //同时加载的模块数量最多是5个，只分割出同时引入的前5个文件
          maxInitialRequests: 3,  //首页加载的时候引入的文件最多3个
          automaticNameDelimiter: '~', //缓存组和生成文件名称之间的连接符
          name: true,                  //缓存组里面的filename生效，覆盖默认命名
          cacheGroups: { //缓存组，将所有加载模块放在缓存里面一起分割打包
            // vendors: {  //自定义打包模块
            //   test: /[\\/]node_modules[\\/]/,
            //   priority: -10, //优先级，先打包到哪个组里面，值越大，优先级越高
            //   filename: 'vendors.js',
            // },
            default: { //默认打包模块
              priority: -20,
              reuseExistingChunk: true, //模块嵌套引入时，判断是否复用已经被打包的模块
              filename: 'common.js'
            },
            elementUi: {
              name: 'chunk-elementUi',
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
              priority: 20
            }
          }
        })

        // 抽离css支持按需加载
        let miniCssExtractPlugin = new MiniCssExtractPlugin({
          filename: 'assets/[name].[hash:8].css',
          chunkFilename: 'assets/[name].[hash:8].css'
        })
        config.plugin('extract-css').use(miniCssExtractPlugin)

        // 移除 preload 插件 （去除默认预加载）
        config.plugins.delete('preload')

        // 移除 prefetch 插件 （去除默认预加载）
        config.plugins.delete('prefetch')

        // 全局引入stylus方法
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))

        // 配置svg规则排除icons目录中svg文件处理
        config.module
          .rule('icons')
          .test(/\.svg$/)
          .include.add(resolve('src/icons'))
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]'
         })
       
        // 配置vue规则
        config.module
          .rule('vue')
          .use('vue-loader')
          .loader('vue-loader')
            .tap(options => {
              // 修改它的选项
              return options
            })

        // 开启gzip压缩
        if (config.productionGzip) {
              const CompressionWebpackPlugin = require('compression-webpack-plugin')
              // 增加浏览器CPU（需要解压缩）， 减少网络传输量和带宽消耗 （需要衡量，一般小文件不需要压缩的）
              // 图片和PDF文件不应该被压缩，因为他们已经是压缩的了，试着压缩他们会浪费CPU资源而且可能潜在增加文件大小。
              config.plugins.push(
                new CompressionWebpackPlugin({
                  asset: '[path].gz[query]',
                  algorithm: 'gzip',
                  test: /\.(js|css)$/,
                  threshold: 10240, // 达到10kb的静态文件进行压缩 按字节计算
                  minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
                  deleteOriginalAssets: false // 使用删除压缩的源文件
                })
              )
        }

        //压缩图片
        //  config.module
        //   .rule('images')
        //   .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        //   .use('image-webpack-loader')
        //     .loader('image-webpack-loader')
        //     .options({
        //       bypassOnDebug: true
        //     })
        //     .end()
    }
}


