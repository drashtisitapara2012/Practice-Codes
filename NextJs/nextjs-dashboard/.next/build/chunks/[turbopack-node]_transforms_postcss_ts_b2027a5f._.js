module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/NextJs/nextjs-dashboard/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "build/chunks/d2c93_3c412964._.js",
  "build/chunks/[root-of-the-server]__11d546c8._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/NextJs/nextjs-dashboard/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];