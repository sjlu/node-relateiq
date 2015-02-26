## node-relateiq

[![Circle CI](https://circleci.com/gh/sjlu/node-relateiq/tree/master.svg?style=svg)](https://circleci.com/gh/sjlu/node-relateiq/tree/master)

This module makes it easier to communicate with the RelateIQ API in a asynchrounous way.

### Install

* You first want to install the package to your project.

        npm install relateiq --save

### Example

    var relateiq = require('relateiq');
    relateiq.createAccount({
      name: "Abacus"
    }, function(err, account) {
      console.log(err);
      console.log(account.id);
    });

You can look at more examples in the [tests](test/test.js).

### License

MIT.

### Notes

This is an ongoing project, not all endpoints are fully supported. This is used in conjunction with [Abacus](https://www.abacus.com/) and is updated to the needs of that product. If you need an endpoint supported, submit a [issue](https://github.com/sjlu/node-relateiq/issues) or make it yourself with a [pull request](https://github.com/sjlu/node-relateiq/pulls).

If you decide to make an endpoint you will need to test your change locally with `npm test`. The key and secret provided may not work so you'll need to use your own test account to do so. All you need to do is create a `.env` file in the root of this project with the following lines.

```
RELATEIQ_KEY=
RELATEIQ_SECRET=
```