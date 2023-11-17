import {
  Transformer,
  gql,
  TransformerContext,
  InvalidDirectiveError,
} from "graphql-transformer-core";
import {
  DirectiveNode,
  ObjectTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  FieldDefinitionNode,
} from "graphql";
import { getBaseType, ModelResourceIDs } from "graphql-transformer-common";

export class BinaryTransformer extends Transformer {
  constructor() {
    super(
      "BinaryTransformer",
      gql`
        directive @binary on FIELD_DEFINITION
      `
    );
  }

  public field = (
    parent: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode,
    definition: FieldDefinitionNode,
    directive: DirectiveNode,
    acc: TransformerContext
  ) => {
    if (!["String"].includes(getBaseType(definition.type))) {
      throw new InvalidDirectiveError(
        'Directive "binary" must be used only on String type fields.'
      );
    }

    const tableName = ModelResourceIDs.ModelTableResourceID(parent.name.value);
    const table = acc.getResource(tableName);
    const fieldName = definition.name.value;
    const AttributeDefinitions = table?.Properties?.AttributeDefinitions;
    let found = false;
    const newAttributeDefinitions = AttributeDefinitions.map((attr: any) => {
      if (attr.AttributeName === fieldName) {
        found = true;
        attr.AttributeType = "B";
      }
      return attr;
    });
    if(!found){
        newAttributeDefinitions.push({
            AttributeName: fieldName,
            AttributeType: "B",
        });
    }
    table.Properties = {
      ...table.Properties,
      AttributeDefinitions: newAttributeDefinitions,
    };
  };
}
