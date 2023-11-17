> Enable DynamoDB's binary scalar type in your AWS Amplify API!

# graphql-binary-transformer


## Installation

`npm install --save graphql-binary-transformer`

## How to use

### Setup custom transformer

Edit `amplify/backend/api/<YOUR_API>/transform.conf.json` and append `"graphql-binary-transformer"` to the `transformers` field.

```json
"transformers": [
    "graphql-binary-transformer"
]
```

### Use @binary directive

Append `@binary` to target fields.

```graphql
type ExpiringChatMessage @model {
  id: ID!
  message: String
  expirationUnixTime: String! @binary
}
```

It is important that the field you use the directive is of type `String`

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
