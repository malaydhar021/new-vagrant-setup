module.exports = {
  chainWebpack: config => {
    config.optimization.delete('splitChunks')
    config.plugins
      .delete('html')
      .delete('preload')
      .delete('prefetch')
  },
  css: {
    extract: false
  },
  configureWebpack: {
    output: {
      filename: 'widget.min.js'
    }
  },
  filenameHashing: false,
  outputDir: require('path').resolve(__dirname, '../lib'),
  pages: {
    index: {
      entry: 'src/main.js'
    }
  },
  productionSourceMap: false
}
