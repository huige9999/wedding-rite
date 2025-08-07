module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  extends: [
    'eslint:recommended',
    'airbnb',
    './.eslintrc-auto-import.json',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  ignorePatterns: ['dist', 'node_modules'],
  plugins: [
    '@typescript-eslint',
    'vue',
    'import',
  ],
  settings: {
    'import/parser': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './',
      },
    },
  },
  globals: {
    uni: true,
    wx: true,
  },
  rules: {
    // 关闭是否定义检查，因为eslint无法检测全局类型
    'no-undef': 'off',
    // 箭头函数可以使用空函数
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] },
    ],
    // 允许vue文件名使用单个单词
    'vue/multi-word-component-names': 'off',
    // 部分文件引入忽略后缀名
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // 可以引入开发环境模块
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    // 非空对象花括号内强制换行
    'object-curly-newline': ['error', {
      // 对象表达式中当有多个属性时，强制换行
      ObjectExpression: {
        multiline: true,
        minProperties: 2,
      },
      // 对象解构中当达到4个属性时，强制换行
      ObjectPattern: {
        multiline: true,
        minProperties: 4,
      },
      // 引入时，永不换行
      ImportDeclaration: 'never',
      // 导出时，当有多个属性时，强制换行
      ExportDeclaration: {
        multiline: true,
        minProperties: 2,
      },
    }],
    // 对象内属性强制换行
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
    // 可以使用console，
    // 无法单独设置生产环境禁止console，因为一旦访问import.meta.env.mode，VScode的EsLint插件就会报错
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    // ts文件默认2个空格缩进
    '@typescript-eslint/indent': ['error', 2],
    // // 可以使用空函数
    // 'no-empty-function': 'off',
    // '@typescript-eslint/ban-ts-comment': 'off',
    // // 空标签必须自闭合（例如组件）
    // 'vue/html-self-closing': ['error', { html: { void: 'never' } }],
    // // 关闭是否定义检查，因为eslint无法检测全局类型
    // 'no-undef': 'off',
    // // 逗号后添加空格
    // 'comma-spacing': ['error', {
    //   before: false,
    //   after: true,
    // }],
    // // 可以使用any
    // '@typescript-eslint/no-explicit-any': 'off',
    // // 运算符两侧添加空格
    // 'space-infix-ops': 'error',
    // // 禁止多个空格
    // 'no-multi-spaces': 'error',
    // // 冒号后加空格
    // 'key-spacing': 'error',
    // // 关闭优先使用默认导出
    // 'import/prefer-default-export': 'off',
    // // 关闭箭头函数参数括号限制（不然有时和长度限制冲突）
    // 'arrow-body-style': 'off',
  },
}
