module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/electron/lib/preload.js',
      builderOptions: {
        productName: 'Collaborative Tacton Generator',
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
