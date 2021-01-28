module.exports = {
  publicPath: '/vueshop/',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        Object.assign(args[0], {
          title: 'vueshop',
          //custom : process.env.NODE_ENV === 'development' ? `<script src="http://172.20.10.5:8082/target/target-script-min.js#anonymous"></script>` : '',
        })
        return args
      }
      )
      .end()

  },