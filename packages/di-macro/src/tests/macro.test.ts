import plugin from 'babel-plugin-macros';
import pluginTester from 'babel-plugin-tester';
import path from 'path';

pluginTester({
  plugin,
  pluginName: 'injectable-macro',
  babelOptions: {
    filename: __filename,
    presets: ['@babel/preset-typescript'],
    plugins: [
      [
        '@babel/plugin-syntax-decorators',
        {
          legacy: true,
        },
      ],
    ],
  },
  snapshot: true,
  tests: [
    {
      title: 'injectable-macro',
      fixture: path.resolve(__dirname, './fixture1.ts'),
    },
  ],
});
