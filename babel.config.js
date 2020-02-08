module.exports = function (api) {
    let presetEnvEnvOptions

    if (api.env("test")) {
        presetEnvEnvOptions = { targets: "current node" }
    } else {
        presetEnvEnvOptions = { modules: false }
    }

    return {
        presets: [
            ["@babel/env", {...presetEnvEnvOptions, useBuiltIns: "usage", corejs: 3}],
            "@babel/typescript",
        ],
        plugins: [
            "@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread",
        ],
        overrides: [{
            test: "**/*.js",
            presets: [
                ["@babel/env", presetEnvEnvOptions],
                "@babel/preset-flow",
            ],
        }],
    };
}
