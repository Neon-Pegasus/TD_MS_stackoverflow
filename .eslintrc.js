module.exports = {
  env: {
      "node": true,
      "es6": true,
      "browser": true,
  },
  extends: ["airbnb"],
  parserOptions: {
      "sourceType": "module",
      "ecmaFeatures": {
          "jsx": false
      }
  },
  rules: {
      "no-underscore-dangle": "off"
  },
};