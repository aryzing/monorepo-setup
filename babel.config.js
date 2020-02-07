module.exports = function (api) {
    let babelEnvOptions

    if (api.env("test")) {
        babelEnvOptions = { targets: { node: 'current' } }
    } else {
        babelEnvOptions = { modules: false }
    }

    return {
        presets: [
            ["@babel/env", babelEnvOptions],
            "@babel/typescript",
        ],
        plugins: [
            "@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread",
        ],
        overrides: [{
            test: "**/*.js",
            presets: [
                ["@babel/env", babelEnvOptions],
                "@babel/preset-flow",
            ],
        }],
    };
}
