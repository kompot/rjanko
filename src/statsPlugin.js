import path from 'path';

export default class StatsPlugin {

  constructor() {
    super();
    this.assets = {};
  }

  apply(cmpl) {
    const self = this;

    cmpl.plugin('emit', (compiler, callback) => {
      const webpackStatsJson = compiler.getStats().toJson();

      const assets = {};
      const filterFn = (val) => path.extname(val) !== '.map';
      for (const chunk in webpackStatsJson.assetsByChunkName) {
        const chunkValue = webpackStatsJson.assetsByChunkName[chunk];
        if (!(chunkValue instanceof Array)) {
          chunkValue = [chunkValue];
        }
        chunkValue
            .filter(filterFn)
            .forEach((val) => {
              if (compiler.options.output.publicPath) {
                val = compiler.options.output.publicPath + val;
              }
              if (!assets[chunk + path.extname(val)]) {
                assets[chunk + path.extname(val)] = val;
              }
            });
      }

      self.assets = assets;

      const json = JSON.stringify(assets, null, 2);

      compiler.assets['_stats.json'] = {
        source: () => json,
        size: () => json.length
      };

      callback();
    });
  }
}
