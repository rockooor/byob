const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
      plugins: [
        new webpack.ProvidePlugin({
            Buffer: [require.resolve("buffer/"), "Buffer"],
        }),
      ],
      resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            path: require.resolve('path-browserify'),
            os: require.resolve('os-browserify/browser'),
            fs: false
        },
      },
    })
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions
  console.log(page.path)
  if (page.path === `/app/`) {
    page.matchPath = `/app/*`
    createPage(page)
  }
}
