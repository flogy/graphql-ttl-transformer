import { GraphQLTransform } from "graphql-transformer-core";
import { DynamoDBModelTransformer } from "graphql-dynamodb-transformer";
import { ModelResourceIDs } from "graphql-transformer-common";
import BinaryTransformer from "../index";

// @ts-ignore
import { AppSyncTransformer } from "graphql-appsync-transformer";

const transformer = new GraphQLTransform({
  transformers: [
    new AppSyncTransformer(),
    new DynamoDBModelTransformer(),
    new BinaryTransformer(),
  ],
});

describe("BinaryTransformer", () => {
  test("Transform string to binary", () => {
    const schema = `
    type MagicLinkSecret
    @model
    {
        userNameHash: String! @binary
    }
  `;
    const properties = getPropertiesOfSchemaTable(schema, "MagicLinkSecret");
    const binaryAttribute = properties.AttributeDefinitions.find((attr: any) => attr.AttributeName === "userNameHash");
    expect(binaryAttribute.AttributeType).toEqual("B");
  });

  const getPropertiesOfSchemaTable = (schema: string, schemaTypeName: string) => {
    const tableName = ModelResourceIDs.ModelTableResourceID(schemaTypeName);
    const resources = transformer.transform(schema).stacks[schemaTypeName]
        .Resources;
    if (!resources) {
      throw new Error("Expected to have resources in the stack");
    }
    const table = resources[tableName];
    if (!table) {
      throw new Error(
          `Expected to have a table resource called ${tableName} in the stack`
      );
    }
    const properties = table.Properties;
    if (!properties) {
      throw new Error(`Expected to have a properties in table ${tableName}`);
    }
    return properties;
  };

});
