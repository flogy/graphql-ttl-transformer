import { GraphQLTransform } from "graphql-transformer-core";
import { DynamoDBModelTransformer } from "graphql-dynamodb-transformer";
import TtlTransformer from "../index";

// @ts-ignore
import { AppSyncTransformer } from "graphql-appsync-transformer";

const transformer = new GraphQLTransform({
  transformers: [
    new AppSyncTransformer(),
    new DynamoDBModelTransformer(),
    new TtlTransformer(),
  ],
});

test("@ttl directive can be used on fields", () => {
  const schema = `
    type ExpiringChatMessage @model {
      id: ID!
      message: String
      expirationUnixTime: Int! @ttl
    }
  `;
  expect(() => transformer.transform(schema)).not.toThrow();
});

test("@ttl directive can not be used on types", () => {
  const schema = `
    type ExpiringChatMessage @model @ttl {
      id: ID!
      message: String
      expirationUnixTime: Int!
    }
  `;
  expect(() => transformer.transform(schema)).toThrowError(
    'Directive "ttl" may not be used on OBJECT.'
  );
});

test("@ttl directive can only be used on fields of type Int", () => {
  const schema = `
    type ExpiringChatMessage @model {
      id: ID!
      message: String
      expirationUnixTime: String! @ttl
    }
  `;
  expect(() => transformer.transform(schema)).toThrowError(
    'Directive "ttl" must be used only on Int type fields.'
  );
});

test("Only one @ttl directive per type is allowed", () => {
  const schema = `
      type ExpiringChatMessage @model {
        id: ID!
        message: String
        expirationUnixTime: Int! @ttl
        anotherExpirationUnixTime: Int! @ttl
      }
    `;
  expect(() => transformer.transform(schema)).toThrowError(
    'Directive "ttl" must be used only once in the same type.'
  );
});

test("Generated CloudFormation document contains the TimeToLiveSpecification property", () => {
  throw new Error("Not yet implemented");
});

test("TimeToLiveSpecification property is pointing to the field where the @ttl directive was used", () => {
  throw new Error("Not yet implemented");
});
