const isProduction = process.env.NODE_ENV === "production"
const proxyConfig = {
  target: "http://dev-web.islide.cc",
  secure: false,
  logLeavel: 'debug'
}
export default {
  entry: "src/index.js",
  extraBabelPlugins: [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
  ],
  env: {
    development: {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  },
  ignoreMomentLocale: true,
  theme: "./src/theme.js",
  html: {
    template: "./src/index.ejs"
  },
  // publicPath: isProduction ? '/enterprise/':  "/",
  disableDynamicImport: true,
  hash: true,//为静态资源生成hash值
  // proxy: (function (configs = []){
  //   var ret = {};
  //   configs.forEach( (config) => {
  //     ret[config.path] = {
  //       target: config.target,
  //       secure: false,
  //       logLeavel: 'debug',
  //       changeOrigin: true
  //     }
  //   })
  //   return ret;
  //   // var config = {};
  //   // context.forEach(function (path){
  //   //   config[path] = proxyConfig;
  //   // });
  //   // return config;
  //   // 这里参数直接填写要代理的路径
  // })([{
  //   path: '/api',
  //   target: 'https://e.b.islide.cc',
  // }, {
  //   path: '/oauth2',
  //   target: 'http://dev-web.islide.cc'
  // }])
}
