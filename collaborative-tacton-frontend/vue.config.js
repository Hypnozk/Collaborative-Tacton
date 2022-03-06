module.exports = {
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'Collaborative Tacton Generator',
      }
    }
  },
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.ts',
      title: 'Collaborative Tacton Generator',
    },
  }
}