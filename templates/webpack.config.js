export const autoPrefixerConfig = JSON.stringify({
  browsers: [
    'last 1 versions',
    'IE 11',
    'Opera 12.1'
  ]
});

export const svgoConfig = JSON.stringify({
  plugins: [
    {removeTitle: true},
    {convertColors: {shorthex: false}},
    {convertPathData: false}
  ]
});

export const resolve = {
  alias: {
    // axios requires `es6-promise` polyfill so we replace it with bluebird
    'es6-promise': 'bluebird'
  },
  extensions: ['', '.js'],
  modulesDirectories: ['src', 'node_modules']
};
