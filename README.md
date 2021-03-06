# Everything I can think about, file by file

* `.eslintignore` ignore emitted files in `dist` directories.
* `.eslintrc.js`
  * `env` No need to specify env (env only used to inform ESLint of sets of globals) b/c the typescript plugin disables `no-unused-vars`, as technically we're using the type system to determine which globals exist.
  * `extends` Extends several eslint configs relevant to this project's tech stack. No effort is made to modify the recommneded settings in accordance with this project's [philosophy](#Philosophy).
    * `eslint:recommended` ESLint's recommneded settings
    * `plugin:@typescript-eslint/eslint-recommended` Modifies rules in `eslint:recommended` so as to be compatible with Typescript projects. Set following [ESLint Plugin TypeScript's recommended settings](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended-configs).
    * `plugin:@typescript-eslint/recommended` Typescript specific lint settings that do **not** require type checking. Set following [ESLint Plugin TypeScript's recommended settings](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended-configs).
    * `plugin:@typescript-eslint/recommended-requiring-type-checkin` Typescript specific lint settings that require type checking. Set following [ESLint Plugin TypeScript's recommended settings](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended-configs).
    * `plugin:react/recommended` Recommended ESLint extension for react. [Docs](https://github.com/yannickcr/eslint-plugin-react#configuration).
    * `plugin:prettier/recommended` Adds Prettier support to ESLint, set following [`eslint-plugin-prettier` docs](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration). We still need to install `prettier` package. Should be [**last**](https://github.com/prettier/eslint-config-prettier/blob/master/README.md#installation) extension. Additional prettier extensions that allow prettier to be compatible with popular community extensions should follow this one.
    * `prettier/@typescript-eslint` Make prettier compatible with `@typescript-eslint/eslint-plugin`.
    * `prettier/react` Make prettier compatible with `eslint-plugin-react`.
  * `globals` No globals necessary b/c the typescript plugin disables `no-unused-vars`, as technically we're using the type system to determine which globals exist.
  * `parser` Using TS parser `@typescript-eslint/parser`, [docs](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#getting-started).
  * `parserOptions` Because we're using type-checking lint rules, we need to specify project location. Note that this project location is relative to the cwd where ESLint runs. The set values ensure that it adequately picks up files in all yarn workspaces regardless of whether ESLint is running from the project root or from within the workspace. When running from the project root, `packages/**/tsconfig.json` and `web/**/tsconfig.json` take care of matching all tsconfigs in all yarn workspaces and `tsconfig.json` will match the project's root `tsconfig.json` (which is redundant as it has an emptiy `files` array and the yarn workspace tsconfigs extend it). When running from a yarn workspace, the `tsconfig.json` will match the workspace's `tsconfig.json` (which again, extends the project's root `tsconfgi.json`) and the other globs will not match anything (which is fine as this is what we want because the matched `tsconfig.json` already contains all the type settings for that workspace).
  * `plugins` for our dev tools TS, React, Prettier.
  * `root` set to `true` to tell ESLint to stop searching for config files above the project root.
  * `settings` only the react version setting required by the react plugin.

* `.gitignore` Typical gitignore
* `babel.config.js` Simple babel config with settings recommneded for TS as per [docs](https://github.com/microsoft/TypeScript-Babel-Starter#create-your-babelrc). Since we're using one `babel.config.js` for the entire project (explanation [here](#Explanation-babel)) we need different module syntax for our test runner (Jest runs on node and needs CommonJS module syntax) and our bundler (Webpack natively understands ES Module syntax, which is what this project is using). 
    * The env preset is configured to automatically add the necessary polyfills via the [`useBuiltIns`](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) option. Babel will add the adequate import statements to all files using a language feature that requires a polyfill. Babel will import polyfills from [`core-js`](https://github.com/zloirock/core-js) and [`regenerator-runtime`](https://www.npmjs.com/package/regenerator-runtime), so these packages must be installed too.
    * Using `core-js` version 3 as that is the [future](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#core-js3-babel-and-a-look-into-the-future) and provides [excellent integration with Babel](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babel).
    * The file also shows how to target specific files in the project that may need specific transpilation settings using the `overrides` option. In this project, we've added support for transpiling flow files too. Babel docs for [`overrides`](https://babeljs.io/docs/en/options#overrides).
    * Intentionally left out React config as it does not provide additional value in this monorepo demo.
* `jest.config.js` This is the jest config that can be used to run tests for the entire project. It leverages Jest's `projects` feature to run all tests for the entire project with a single Jest instance. The regexp used for `projects` imposes a convention whereby packages must contain a `jest.config.js`. This is to help ensure that we run tests only for projects which have been set up properly (they should have their own `jest.config.js`, which should adhere to the [convention](#Jest-conventions)). Although at this level we can't enforce that matched `jest.config.js` files adhere to the convention, we at least ensure that we're runnig tests for packages that contain a config file. This also prevents Jest from running in projects that would otherwise match if the config file name was omitted (`"<rootDir>/packages/*"`) but had no config set up (in which case Jest's default values would be used, which is not what we want as those won't work in this project.) We're also using the `baseConfig` that all tests should be run with.
* `package.json`
    * Workspaces for yarn set in `"workspaces"`
    * script `build-packages` will take care to properly bootstrap the project by building the packages the MFEs rely on in the appropriate order.
    * script `clean` will remove all `node_modules` and `dist` in entire project.
    * script `test` will run all tests in the repo. It will use the top level `jest.config.js` as it's source of configuration.
    * The `devDependencies` are dev dependencies that should be used by all packages. This ensures all builds are built with the same version of the tooling used.
    * `dependencies` This project uses a [dependency management strategy](#Dependency-handling) which expects the following dependencies
        * all project packages in `packages`
        * all peer dependencies from packages in `packages`
        * as many dependencies as possible from packages in `web` and `packages` 
    * `browserslist` Used by Babel to generate transpiled code, using [default config location](https://github.com/browserslist/browserslist#queries) and [default config settings](https://github.com/browserslist/browserslist#full-list).
* `tsconfig.json` Contains the Typescript settings for all packages in this project. The convention this project follows is that all packages should extend the config from this one, as recommended by [guide](https://www.typescriptlang.org/docs/handbook/project-references.html#guidance).
    * `target` set to `esnext` loads latest types for the language. Only using Typescript for type-checking, Babel is used for transpilation (explanation [here](#Explanation-Babel-for-transpiling-Typescript)).
    * Maximum type strictness settings are set, node resolution as is what most people expect, allow default imports for packages, and the recommended consistent casing enforcement (Mac and Win are case insensitive).
    * `preserveWatchOutput` to avoid tsc clear console command from removing webpack's output when tools run in same process like in `dev` script in MFEs.
    * `files` empty array to avoid TS from processing entire repo, as suggested in [Project References docs](https://www.typescriptlang.org/docs/handbook/project-references.html#overall-structure).
    * `references` using project references for faster incremental builds. [Project References docs](https://www.typescriptlang.org/docs/handbook/project-references.html#overall-structure). Technically we don't need 
* `yarn.lock` ...
* `config/jest.babelRootMode.js` This file exists because Jest does not provide an API to configure its internal instance of `babel-jest` that it uses to transpile files. This instance needs to be configured to ensure source code is correctly transpiled in a monorepo setting (explanation [here](#Explanation-babel)). The only way of achieving this in the context of Jest is by creating a new instance of the `babel-jest` transformer with the desired settings. [Babel docs](https://babeljs.io/docs/en/config-files#jest).
* `config/jest.base.js` Uses all default values except for `transform`. The transform's regex is kept as per the default value, and the transformer points to a custom transfromer instance. This transformer instance exists because Jest does not provide an API to configure its internal instance of `babel-jest` that it uses to transpile files. This instance needs to be configured to ensure source code is correctly transpiled in a monorepo setting (explanation [here](#Explanation-Babel)). The only way of achieving this in the context of Jest is by creating a new instance of the `babel-jest` transformer with the desired settings. [Babel docs](https://babeljs.io/docs/en/config-files#jest).
* `config/webpack.config.dev.js` Weback config to bundle MFE packages in dev mode. The rest of the explanation [here](#Explanation-Webpack).
* `config/webpack.config.prod.js` Weback config to bundle MFE packages in dev mode. The rest of the explanation [here](#Explanation-Webpack).
* `packages/<pkg>/jest.config.js` All packages (`packages` and `web`) have a `jest.config.js` that ensures that only tests from the package are run, inspired by [post](http://orlandobayo.com/blog/monorepo-testing-using-jest/). **Why do we want this?**
    * imports base config
    * Follows the convention the root dir should be the project root so that the same config applies whether jest's cwd is the project root or the package dir.
* `packages/<pkg>/package.json`
    * `name` is namespaced by private org and matches package dir name.
    * `private` marked as true [required by yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/#toc-how-to-use-it).
    * `version` an adequate semver
    * `main` and `module` should both point to `dist/index.js`. That's where Babel (script `build`) will place the transpiled code based on the package dir structure. The entry for the source code should be in `<pkg>/src/index.ts`. Although we're using modules (see [discussion](https://github.com/rollup/rollup/wiki/pkg.module)), `main` is left only as a reminder as it does not influence how code is bundled in this project (webpack treats these two fields interchangeably).
    * `types` types emitted by TS
    * `scripts`
        * `postinstall` builds all packages after running `yarn install`, and is part of the steps taken to make lerna unnecessary (see [explanation](#Look-ma',-no-lerna!)).
        * `build`, `build:types`, `build:js` for transpiling code and generating types, placing results in `<pkg>/dist`. Necessary source maps are generated to enable code navigation in editor (TS declaration maps) and for user's build tools to incorporate them (babel inline source maps).
        * `dev*` same as build but in watch mode.
        * `test` will run tests for `<pkg>`.
    * `sideEffects` used by webpack to tree-shake code. See [guide](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free) and [docs](https://webpack.js.org/configuration/optimization/#optimizationsideeffects).
    * `dependencies` No dependencies for packages should be declared, only `peerDependencies`.
    * `devDependencies` Should be empty, as they should be declared in project's root `package.json`.
    * `peerDependencies` All packages in `packages` should declare their dependencies as `peerDependencies`. Also need to declare them in project's root `package.json`.
* `tsconfig.json` All packages in `packages` should have this exact same config settings.
    * `extends` Contains project wide common settings
    * `composite` A must have for project usigng Project References, see [docs](http://www.typescriptlang.org/docs/handbook/project-references.html#what-is-a-project-reference).
    * `declaration` Must be turned on for composite projects, see [docs](http://www.typescriptlang.org/docs/handbook/project-references.html#what-is-a-project-reference).
    * `emitDeclarationOnly` because we're using Babel for transpiled code, so we only need type information. See [explanation](#Explanation-Babel-for-transpiling-Typescript).
    * `rootDir` set to `src` so that the emitted file tree struture starts at `src` rather than at the package root (eg, `<pkg>/dist/types/index.d.ts` vs `<pkg>/dist/types/src/index.d.ts)`
    * `outDir` to have types in their own directory.
    * `include` include all files in `src` dir. All packages are expected to have their source in a `src` dir.
    * `exclude` Note that there is no exclude field, so declaration files for tests will be emitted too. 

# Dependency handling

The top level `package.json`'s dependencies should include all `peerDependencies` delcared in packages from `packages`. This is to ensure that when a MFE bundle is created, the package is available during the build. During package installation, Yarn issues a warning for peer dependencies from `packages` that are not declared as dependencies. When this happens, we should install add them to ensure MFEs build correctly. This also has the added benefit that all MFEs use the same versions of peer dependencies of packages in `packages`. 

Although packages in `web` and `packages` may have their own dependencies with whichever version is suitable, it is highly recommended to have all dependencies declared at the top level. Thes helps all code use the same versions for dependencies. 

The project's own `packages` should also be dependencies because they're expected to be always in scope for MFE builds and MFE builds should use the most recent workspace code (as if the packages were evergreen). Packages in `packages` have version numbers only to comply with expected `package.json` standards, but are otherwise unused.

The benefits of this dependency handling strategy are 
 
* having a single source of truth for which versions are being used in the project
* avoiding problems related to using different versions of the same libraries
* facilitating upgrades to newer versions of a dependency, as any necessary code transformations will be the same
* facilitating optimizations when similar libraries are used. These may be technical (eg, choosing b/w lodash and ramda, resulting in smaller bundles), educational (opportunity to have an code-review session w/ devs to ensure we're all on same page), conflict-resolution, or objective/vision clarification, among others.


# Jest conventions

* All Jest configs have the project root as the Jest root. This allows configs to be mostly the same, and makes included files and paths easier to reason about. Makes paths easier to reason about when importing base Jest config.
* All Jest projects have a `displayName` that is extracted from their package name.

# Explanation Babel

In this repo we're leveraging Babel's `rootMode` feature in order to have a single `babel.config.js` in the entire monorepo controlling transpilation settings for all packages and MFEs. In order to get the desired transpilation results, instances of babel should run with `rootMode` set to `upward` so that they use this file (see [docs](https://babeljs.io/docs/en/config-files#root-babelconfigjs-babelconfigcjs-and-babelconfigjson-files)). Although Babel allows for [file-relative configuration](https://babeljs.io/docs/en/config-files#file-relative-configuration), this project uses `overrides` to keep all Babel config settings in a single file.

# Explanation Webpack

* Using `process.cwd()` for calculating entry and output files. Using this allows us to have a single webpack file for the entire project. 
* Tooling such as `yarn` and `lerna` will `cd` into the directory of the package they're executing the command on
* Running build script from the directory of the package will work too
* This imposes the convention that all packages must have `src/index.ts` as their entry.
* `babel-loader` set with `rootMode: "upward"`, see explanation [here](#Explanation-babel)

# Explanation Babel for transpiling Typescript

Babel's declarative `env` preset transformations are more comfortable to use over Typescript's imperative transpilation settings. With Typescript, we need to manually sync and take care of the language features we're using (see [post](https://stackoverflow.com/questions/51043439/using-latest-javascript-features-in-typescript-such-as-es2018/51044240#51044240)), wheras Babel has a "set-and-forget" approach whereby it leverages compat table through the env present to appropriatly transpile code as needed by the desired browser support and typically expressed througha `.browserlist` file.

# Look ma', no lerna!

Most tools used in this project are monorepo aware and we therefore do not need lerna. Rarely is it necessary to perform the same individual action on all packages, and should such a scenario arise, it can be taken care of with Yarn.

**`postinstall` script in packages**

This will automatically build packages in `packages` after running `yarn install` or `yarn add`.
  

# Legacy flow can be controlled by overrides

But there will be no support for mixed MFEs: it's either flow or TS. Mixed MFEs are too hard to support.

# Project commands should always be executed in project root

The setup already has taken into consideration that some commadns will `cd` into the package for which the command is being run, like when using yarn.

# Why we need two tsconfig files in packages

Because tsc does not allow to confgure top level props like `excludes`. This means that when running tsc, we'd have to choose between typechecking and emitting the tests, or completely ignoring the tests for output generation and type checking.

https://github.com/microsoft/TypeScript/issues/32380

# Future 

* package (`pacakges` and `web`) creation scripts
* platform tests: because there is a lot of stuff going on and may be hard to remember, we'll set up tests with helpful reminders on project conventions.

# `dev:types` in packages vs in mfes (packages target the build script).

# No babel-cli output in watch mode

See [issue](https://github.com/babel/babel/issues/7926). Transpilation still works as expected, and errors are reported in terminal.

# FAQ

<!-- These were  here before -->

# Packages

* `"build:js": "babel src --out-dir lib --extensions \".ts,.tsx\" --source-maps inline --root-mode upward"`. Added the `--root-mode upward` part.
* They should get config from root ts config, and override necessary bits.

# MFEs

* Webpack settings for `babel-loader` should include 

```js
const config = {
    module: {
        rules: [{
            loader: "babel-loader",
            options: {
            rootMode: "upward",
            }
        }]
    }
}
```

# Decisions

* All transpiling controlled from repo root `babel.config.js`, tweaks to individual files/repos to be done with [`overrides`](https://babeljs.io/docs/en/options#overrides).

# Dead code elimination / tree-shaking

# Future tasks

* Have ESLint properly target files that are not in a worksapce, proably with overrides

# Philosophy

Keeping it simple. 

The JS ecosystem has limitless config possibilities. In this project, we're keeping the configs as simple as possible by using mostly recommended or default settings.

The there is a high cost of opportunity in fine tuning the configs of our dev tools. As such, this project leverages the defaults and recommneded settings established by the community.