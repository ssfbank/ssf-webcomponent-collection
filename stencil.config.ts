import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'ssf-webcomponent-collection',
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  globalScript: "src/polyfills.ts",
  globalStyle: "src/scss/index.scss",
  plugins: [
    sass({injectGlobalPaths: [
      'src/scss/index.scss'
    ]})
  ],
};
