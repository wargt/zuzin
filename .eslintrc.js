module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  globals: {
    page: true,
    browser: true,
    Router: true,
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    "airbnb-base",
    "plugin:vue/recommended"
  ],
  // required to lint *.vue files
  plugins: [
    "vue",
    "import"
  ],
  // add your custom rules here
  rules: {
    "indent": ["error", 2],
    "vue/attribute-hyphenation": ["error", "never", {
      "ignore": ["custom-prop"]
    }],
    "no-irregular-whitespace": ["error", { "skipTemplates": true }],
    "vue/max-attributes-per-line": ["error", {
      "singleline": 5,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "vue/script-indent": ["error", 2, { "baseIndent": 1 }],
    "semi": ["error", "never"],
    "space-before-function-paren": ["error", "always"],
    "import/no-unresolved": "off",
    "comma-dangle": ["error", "never"],
    "padded-blocks": "off",
    "lines-around-directive": ["error", { "before": "always", "after": "always" }],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "return" },
      { blankLine: "always", prev: "*", next: "for" },
      { blankLine: "always", prev: "*", next: "function" },
      { blankLine: "always", prev: "*", next: "switch" },
      { blankLine: "always", prev: "*", next: "if" }
    ],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "import/no-extraneous-dependencies": "off",
    "import/extensions": "off",
    "no-bitwise": ["error", { "allow": ["~"] }],
    "no-param-reassign": "off",
    "no-continue": "off",
    "consistent-return": "off",
    "no-prototype-builtins": "off",
    "no-restricted-syntax": "off",
    "no-trailing-spaces": ["error", { "skipBlankLines": true }],
    "object-curly-newline": "off",
    "arrow-parens": ["error", "as-needed"],
    "max-len": ['error', 200, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }]
  },
  'overrides': [
    {
      'files': ['*.vue'],
      'rules': {
        'indent': 'off'
      }
    }
  ]
}
