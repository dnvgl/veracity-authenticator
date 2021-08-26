module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      title: "Logged in",
    },
  },
  transpileDependencies: [
    "bootstrap-vue",
    "@dnvgl-onefoundation/onedesign-vue",
  ],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(node)$/,
          parser: { amd: false },
          use: {
            loader: "@vercel/webpack-asset-relocator-loader",
            options: {
              outputAssetBase: "native_modules",
            },
          },
        },
      ],
    },
  },
  pluginOptions: {
    electronBuilder: {
      productName: "Veracity Authenticator",
      appId: "dnv.veracityauth",
      preload: "src/preload.js",
      externals: ["keytar"],
      builderOptions: {
        publish: ["github"],
        productName: "Logged in",
      },
    },
  },
};
