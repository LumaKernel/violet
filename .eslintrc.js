const fs = require('fs')
const path = require('path')
const pkgs = fs.readdirSync(path.join(__dirname, 'pkg'))
module.exports = {
  root: true,
  ignorePatterns: ['!*.js', '!*.cjs', '!*.mjs', '!*.ts'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react', 'import'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': [2, { ignore: ['children'] }],
    complexity: ['error', 5],
    'max-depth': ['error', 1],
    'max-nested-callbacks': ['error', 3],
    'max-lines': ['error', 200],
    'prefer-template': 'error',
    'import/order': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'object-shorthand': [
      'error',
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: { '@typescript-eslint/no-var-requires': ['off'] },
    },
    ...pkgs.map((pkg) => ({
      files: [`pkg/${pkg}/**/*.js`, `pkg/${pkg}/**/*.ts`, `pkg/${pkg}/**/*.tsx`],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['.prisma/*'],
                message: `do not use .prisma/* instead use @prisma/*`,
              },
              {
                group: [
                  ...pkgs
                    .filter((pkg2) => pkg2 !== pkg && !['api', 'def', 'lib'].includes(pkg2))
                    .map((pkg2) => `@violet/${pkg2}`),
                  ...(pkg === 'api'
                    ? []
                    : [
                        // '!@violet/api/api/$api' と指定したいがglobの否定が使えないのでfsで代用
                        ...fs
                          .readdirSync(path.join(__dirname, 'pkg/api'), {
                            withFileTypes: true,
                          })
                          .filter((d) => d.name !== 'api')
                          .map(
                            (d) =>
                              `@violet/api/${
                                d.isFile() ? d.name.replace(/\.(ts|js)$/, '') : d.name
                              }`
                          ),
                        ...fs
                          .readdirSync(path.join(__dirname, 'pkg/api/api'), {
                            withFileTypes: true,
                          })
                          .filter((d) => d.name !== '$api.ts')
                          .map(
                            (d) =>
                              `@violet/api/api/${
                                d.isFile() ? d.name.replace(/\.(ts|js)$/, '') : d.name
                              }`
                          ),
                      ]),
                ],
                message: `only allowed to import modules under @violet/${pkg}, @violet/def, @violet/lib and @violet/api/api/$api`,
              },
            ],
          },
        ],
      },
    })),
  ],
}
