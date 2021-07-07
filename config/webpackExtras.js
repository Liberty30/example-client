const resolve = require("resolve");
const TerserPlugin = require("terser-webpack-plugin");
const {WebpackManifestPlugin} = require("webpack-manifest-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");
const postcssNormalize = require("postcss-normalize");
const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

// This is only used in production mode
const createTerserPlugin = function (isEnvProduction) {
  const isEnvProductionProfile = isEnvProduction && process.argv.includes("--profile");

  return new TerserPlugin({
    parallel: false,
    terserOptions: {
      parse: {
        // We want terser to parse ecma 8 code. However, we don't want it
        // to apply any minification steps that turns valid ecma 5 code
        // into invalid ecma 5 code. This is why the 'compress' and 'output'
        // sections only apply transformations that are ecma 5 safe
        // https://github.com/facebook/create-react-app/pull/4234
        ecma: 8,
      },
      compress: {
        ecma: 5,
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebook/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
        // Disabled because of an issue with Terser breaking valid code:
        // https://github.com/facebook/create-react-app/issues/5250
        // Pending further investigation:
        // https://github.com/terser-js/terser/issues/120
        inline: 2,
      },
      // Added for profiling in devtools
      keep_classnames: isEnvProductionProfile,
      keep_fnames: isEnvProductionProfile,
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true,
      },
    },
    sourceMap: shouldUseSourceMap,
  })
}

const getStyleLoaders = (
  isEnvProduction,
  cssOptions,
  preProcessor,
  preProcessorOptions = {}
) => {
  const isEnvDevelopment = !isEnvProduction
  const loaders = [
    isEnvDevelopment && require.resolve("style-loader"),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith(".")
        ? {publicPath: "../../"}
        : {},
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009",
              },
              stage: 3,
            }),
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            postcssNormalize(),
          ],
        },
        sourceMap: isEnvProduction && shouldUseSourceMap,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
          ...preProcessorOptions,
        },
      }
    );
  }
  return loaders;
};

// Ensures formatting
const createEsLintPlugin = function () {
  return new ESLintPlugin({
    formatter: require.resolve("react-dev-utils/eslintFormatter"),
    context: paths.appSrc,
  })
}


// Generates an `index.html` file with the <script> injected.
const createHtmlPlugin = function (isEnvProduction) {
  new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        inject: true,
        template: paths.appHtml,
      },
      isEnvProduction
        ? {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }
        : undefined
    )
  )
}

const createManifestPlugin = function () {
  return new WebpackManifestPlugin({
    fileName: "asset-manifest.json",
    publicPath: paths.publicUrlOrPath,
    generate: (seed, files, entrypoints) => {
      const manifestFiles = files.reduce((manifest, file) => {
        manifest[file.name] = file.path;
        return manifest;
      }, seed);
      const entrypointFiles = entrypoints.main.filter(
        (fileName) => !fileName.endsWith(".map")
      );

      return {
        files: manifestFiles,
        entrypoints: entrypointFiles,
      };
    },
  })
}

const createWorkboxPlugin = function () {
  new WorkboxWebpackPlugin.GenerateSW({
    clientsClaim: true,
    exclude: [/\.map$/, /asset-manifest\.json$/],
    maximumFileSizeToCacheInBytes: 3097152,
    navigateFallback: paths.publicUrlOrPath + "index.html",
    navigateFallbackDenylist: [
      // Exclude URLs starting with /_, as they're likely an API call
      new RegExp("^/_"),
      // Exclude any URLs whose last part seems to be a file extension
      // as they're likely a resource and not a SPA route.
      // URLs containing a "?" character won't be blacklisted as they're likely
      // a route with query params (e.g. auth callbacks).
      new RegExp("/[^/?]+\\.[^/]+$"),
    ],
  })
}

const createForkTsCheckerPlugin = function (isEnvProduction) {
  new ForkTsCheckerWebpackPlugin({
    typescript: resolve.sync("typescript", {
      basedir: paths.appNodeModules,
    }),
    async: !isEnvProduction,
    useTypescriptIncrementalApi: true,
    checkSyntacticErrors: true,
    resolveModuleNameModule: process.versions.pnp
      ? `${__dirname}/pnpTs.js`
      : undefined,
    resolveTypeReferenceDirectiveModule: process.versions.pnp
      ? `${__dirname}/pnpTs.js`
      : undefined,
    tsconfig: paths.appTsConfig,
    reportFiles: [
      "**",
      "!**/__tests__/**",
      "!**/?(*.)(spec|test).*",
      "!**/src/setupProxy.*",
      "!**/src/setupTests.*",
    ],
    silent: true,
    // The formatter is invoked directly in WebpackDevServerUtils during development
    formatter: isEnvProduction ? typescriptFormatter : undefined,
  })
}

module.exports = {
  createEsLintPlugin,
  createForkTsCheckerPlugin,
  createHtmlPlugin,
  createManifestPlugin,
  createTerserPlugin,
  createWorkboxPlugin,
  getStyleLoaders
}
