import path from "path";
import { getPackages } from "@lerna/project";
import { filterPackages } from "@lerna/filter-packages";
import batchPackages from "@lerna/batch-packages";
import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import bundleSize from "rollup-plugin-bundle-size";

const production = false;

export default {
  input: "./src/main.ts",
  output: [
    {
      sourcemap: true,
      format: "es",
      name: "di-context",
      file: "./dist/main.js",
    } /* Add any other configs (for esm or iife format?) */,
  ],
  plugins: [
    svelte({
      emitCss: false,
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: true,
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
      rootDir: "./src",
      declaration: true,
      declarationDir: "./dist",
      declarationMap: true,
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    // !production // && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    // !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
    bundleSize(),
  ],
  watch: {
    clearScreen: false,
  },
};

// const packages = ["my-element", "my-element-2", "svelte-element"];
// const configs = [];

// const basePath = path.relative(__dirname, "packages");

// packages.forEach((name) => {
//   configs.push({});
// });
