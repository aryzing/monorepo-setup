const flowConfig = {}

// maybe
const baseConfig = {}

// maybe
// babel, jest, webpack, dotfiles and config files

/**
 * Tools run on node, do not need browser vars, node supports a pretty recent
 * version of ES
 */
const toolsConfig = {
    env: {
        browser: false,
        node: true,
        es2017: true,
        // we're not transpiling .js files that are run in node for config
        // tools, and we're currently only supporting up to LTS version (link)
        es2020: false, 
    }
} 

module.exports = {
    /**
     * No need to specify env (env only used to inform ESLint of sets of
     * globals) b/c the typescript plugin disables `no-unused-vars`, as
     * technically we're using the type system to determine which globals exist.
     */
    // "env": {},
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint",
        "prettier/react",
    ],
    /**
     * No globals necessary b/c the typescript plugin disables `no-unused-vars`,
     * as technically we're using the type system to determine which globals
     * exist
     */
    // "globals": {},
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": ['packages/**/tsconfig.json', 'web/**/tsconfig.json', 'tsconfig.json'],
    },
    "plugins": [
        "@typescript-eslint",
        "react",
        "prettier",
    ],
    "root": true,
    "rules": {
    },
    "settings": {
        "react":  {
            "version": 'detect',
        },
    }
};