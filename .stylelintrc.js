module.exports = {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-standard-vue/scss",
    "stylelint-config-recess-order-rjz"
  ],
  rules: {
    indentation: [
      2,
      {
        baseIndentLevel: 0
      }
    ],
    "declaration-empty-line-before": null,
    "at-rule-empty-line-before": "always",
    // 类名可以使用短横线和下划线
    "selector-class-pattern": "[a-z0-9_-]+",
    // 变量名可以使用驼峰命名法
    "scss/dollar-variable-pattern": "[a-zA-Z0-9]+",
  }
}
