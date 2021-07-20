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
import minimist from "minimist";

// const production = !process.env.ROLLUP_WATCH;

const production = false;

/**
 * @param {string}[scope] - packages to only build (if you don't
 *    want to build everything)
 * @param {string}[ignore] - packages to not build
 *
 * @returns {string[]} - sorted list of Package objects that
 *    represent packages to be built.
 */
async function getSortedPackages(scope, ignore) {
  const packages = await getPackages(__dirname);
  const filtered = filterPackages(packages, scope, ignore, false);

  return batchPackages(filtered).reduce((arr, batch) => arr.concat(batch), []);
}

async function main() {
  const config = [];

  // Support --scope and --ignore globs if passed in via commandline
  const { scope, ignore } = minimist(process.argv.slice(2));

  const packages = await getSortedPackages(scope, ignore);

  packages.forEach((pkg) => {
    /* Absolute path to package directory */
    const basePath = path.relative(__dirname, pkg.location);

    /* Absolute path to input file */
    const input = path.join(basePath, "src/main.ts");

    /* "main" field from package.json file. */
    const { main } = pkg.toJSON();

    // console.log("Root:", path.join(basePath, "src"));
    // console.log(basePath);

    /* Push build config for this package. */
    config.push({
      input,
      output: [
        {
          sourcemap: true,
          format: "iife",
          name: "app",
          file: path.join(basePath, main),
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
          // rootDir: path.join(basePath, "src"),
          // declaration: true,
          // declarationDir: path.join(basePath, "dist"),
          // declarationMap: true,
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
      ],
      watch: {
        clearScreen: false,
      },
    });
  });

  return config;
}

main();

export default main();

// const packages = ["my-element", "my-element-2", "svelte-element"];
// const configs = [];

// const basePath = path.relative(__dirname, "packages");

// packages.forEach((name) => {
//   configs.push({});
// });
