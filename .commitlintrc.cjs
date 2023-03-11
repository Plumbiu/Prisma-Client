const { keyword } = require('./forbidanWords.cjs')

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'forbidan-keyword': [2, 'always']
  },
  plugins: [
    {
      rules: {
        'forbidan-keyword': ({ subject }) => {
          const reg = new RegExp(`(${keyword.join('|')})`, 'g')
          return [!reg.test(subject), `含有敏感词--${subject?.match(reg)?.join('')}`]
        }
      }
    }
  ]
}
