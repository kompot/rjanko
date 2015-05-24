import path from 'path';

export default class StatsPlugin {

  constructor() {
    this.assets = {};
  }

  apply(cmpl) {
    const self = this;

    cmpl.plugin('emit', (compiler, callback) => {
      const webpackStatsJson = compiler.getStats().toJson();

      const assets = {};
      const filterFn = (val) => path.extname(val) !== '.map';
      const forEachFn = (chunk, val) => {
        let newVal = val;
        if (compiler.options.output.publicPath) {
          newVal = compiler.options.output.publicPath + val;
        }
        if (!assets[chunk + path.extname(val)]) {
          assets[chunk + path.extname(val)] = newVal;
        }
      };
      Object.keys(webpackStatsJson.assetsByChunkName).map((chunk) => {
        let chunkValue = webpackStatsJson.assetsByChunkName[chunk];
        if (!(chunkValue instanceof Array)) {
          chunkValue = [chunkValue];
        }
        chunkValue
            .filter(filterFn)
            .forEach(forEachFn.bind(this, chunk));
      });

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
