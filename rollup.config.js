// rollup.config.js
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import { terser } from "rollup-plugin-terser";
import url from "rollup-plugin-url"

export default {
  input: 'index.js',
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    babel(),
    json(),
    url(),
    terser(),
  ]
};
