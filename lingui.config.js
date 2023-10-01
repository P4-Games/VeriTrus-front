const { formatter } = require("@lingui/format-po")

const locales = ["en-us", "nl-nl"]

if (process.env.NODE_ENV !== "production") {
  locales.push("pseudo")
}

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: locales,
  sourceLocale: "en-us",
  pseudoLocale: "pseudo",
  catalogs: [
    {
      path: "./translations/locales/{locale}",
      include: [
        "./translations/languages.ts",
        "./app",
        "./components",
        "./providers",
      ],
    },
  ],
  format: formatter({ origins: false }),
}