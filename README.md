> ♻ Enable DynamoDB's time-to-live feature to auto-delete old entries in your AWS Amplify API!

# graphql-ttl-transformer

[![Pull requests are welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen)](#contribute-)
[![npm](https://img.shields.io/npm/v/graphql-ttl-transformer)](https://www.npmjs.com/package/graphql-ttl-transformer)
[![GitHub license](https://img.shields.io/github/license/flogy/graphql-ttl-transformer)](https://github.com/flogy/graphql-ttl-transformer/blob/master/LICENSE)

## Installation

`npm install --save graphql-ttl-transformer`

## How to use

### Setup custom transformer

Edit `amplify/backend/api/<YOUR_API>/transform.conf.json` and append `"graphql-ttl-transformer"` to the `transformers` field.

```json
"transformers": [
    "graphql-ttl-transformer"
]
```

### Use @ttl directive

Append `@ttl` to target fields.

```graphql
type ExpiringChatMessage @model {
  id: ID!
  message: String
  expirationUnixTime: AWSTimestamp! @ttl
}
```

It is important that the field you use the directive is of type `AWSTimestamp` (recommended) or `Int`, as the expiration timestamp must be in [Unix time](https://en.wikipedia.org/wiki/Unix_time) format.

## Contribute 🦸

Contributions are more than welcome! I love how AWS Amplify helps us developers building great apps in a short time. That's why I'd like to give back with contributions like this. If you feel the same and would like to join me in this project it would be awesome to get in touch! 😊

Please feel free to create, comment and of course solve some of the issues. To get started you can also go for the easier issues marked with the `good first issue` label if you like.

### Development

1. Clone this repository and open it in your code editor.
2. Run `npm link` in the cloned project directory and `npm link graphql-tts-transformer` in your test project where you want to use it. Maybe you'll have to uninstall the previously installed dependency as installed from NPM repository.
3. Run `npm start` in your cloned project directory. Every code change is now immediately used in your test project, so you can just modify code and test it using `amplify codegen models` or `amplify push`.

**Hint:** It is important to always make sure the version of the installed `graphql` dependency matches the `graphql` version the `graphql-transformer-core` depends on.

### Publish new NPM package version

1. Make sure version number is updated.
2. Run `npm publish`.
3. Create new release in GitHub including a tag.

## License

The [MIT License](LICENSE)

## Credits

The _graphql-ttl-transformer_ library is maintained and sponsored by the Swiss web and mobile app development company [Florian Gyger Software](https://floriangyger.ch).

If this library saved you some time and money please consider [sponsoring me](https://github.com/sponsors/flogy), so I can build more libraries for free and actively maintain them for you. Thank you 🙏
