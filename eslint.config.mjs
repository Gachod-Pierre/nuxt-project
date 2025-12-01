// eslint.config.mjs
// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import stylistic from "@stylistic/eslint-plugin";

export default withNuxt({
  ignores: ["assets/vendor/**"],
  files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.vue"],
  plugins: {
    "@stylistic/js": stylistic,
  },
  rules: {
    "@stylistic/js/semi": ["error", "never"],
    "@stylistic/js/array-bracket-spacing": ["error", "never"],
    "@stylistic/js/comma-dangle": ["error", "never"],
    curly: ["error", "multi-line"],
    "@stylistic/js/indent": ["error", 2, { SwitchCase: 1 }],
    "no-console": "warn",
    "vue/html-indent": ["error", 2],
    "@stylistic/js/no-multi-spaces": "error",
    "@stylistic/js/no-multiple-empty-lines": "error",
    "no-var": "error",
    "@stylistic/js/object-curly-spacing": ["error", "always"],
    "prefer-const": "error",
    "@stylistic/js/quotes": ["error", "single"],
    "@stylistic/js/space-in-parens": "error",
    "@stylistic/js/space-before-function-paren": ["error", "always"],
  },
}).override("nuxt/vue/rules", {
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/no-v-html": "off",
    "vue/max-attributes-per-line": ["error", { singleline: 5 }],
  },
});
