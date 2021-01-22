/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        "static/js": '/js',
        "static/css": '/css',
    },
    plugins: [
        /* ... */
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        // {"match": "routes", "src": ".*", "dest": "/index.html"},
    ],
    optimize: {
        /* Example: Bundle your final build: */
        // "bundle": true,
    },
    packageOptions: {
        /* ... */
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        out: "dist"
    },
};
