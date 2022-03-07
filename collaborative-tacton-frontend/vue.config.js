module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'Collaborative Tacton Generator',
        preload: 'src/electron/lib/preload.js',
      }
    }
  },
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      title: 'Collaborative Tacton Generator',
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `
              @import "~@/renderer/scss/_variables.scss";
              @import "~@/renderer/scss/_mixins.scss";
            `,
      },
    },
  },
};
