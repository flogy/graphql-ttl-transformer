> Enable DynamoDB's time-to-live feature to auto-delete old entries in your AWS Amplify API!

# graphql-ttl-transformer

⚠️ This project is under heavy development, so breaking changes may occur on our road to a stable v1.0.0. Any bug reports and [contributions](#contribute-) will be highly appreciated.

[![Pull requests are welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen)](#contribute-)
[![npm](https://img.shields.io/npm/v/graphql-ttl-transformer)](https://www.npmjs.com/package/graphql-ttl-transformer)
[![GitHub license](https://img.shields.io/github/license/flogy/graphql-ttl-transformer)](https://github.com/flogy/graphql-ttl-transformer/blob/master/LICENSE)

## Installation

`npm install --save graphql-ttl-transformer`

## How to use

### Setup custom transformer

Edit `amplify/backend/api/<YOUR_API>/transform.conf.json` and append `"./graphql-ttl-transformer"` to the `transformers` field.

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
  expirationUnixTime: Int! @ttl
}
```

It is important that the field you use the directive is of type `Int`, as the expiration timestamp must be in [Unix time](https://en.wikipedia.org/wiki/Unix_time) format.

## Contribute 🦸

Contributions are more than welcome! I love how AWS Amplify helps us developers building great apps in a short time. That's why I'd like to give back with contributions like this. If you feel the same and would like to join me in this project it would be awesome to get in touch! 😊

Please feel free to create, comment and of course solve some of the issues. To get started you can also go for the easier issues marked with the `good first issue` label if you like.

## License

The [MIT License](LICENSE)

## Credits

The _graphql-ttl-transformer_ library is maintained and sponsored by the Swiss web and mobile app development company [Florian Gyger Software](https://floriangyger.ch).
