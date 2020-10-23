import { Transformer, gql, TransformerContext } from "graphql-transformer-core";
import {
  DirectiveNode,
  ObjectTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  FieldDefinitionNode,
} from "graphql";
import { getBaseType } from "graphql-transformer-common";

export class TtlTransformer extends Transformer {
  constructor() {
    super(
      "TtlTransformer",
      gql`
        directive @ttl on FIELD_DEFINITION
      `
    );
  }

  public field = (
    parent: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode,
    definition: FieldDefinitionNode,
    directive: DirectiveNode,
    acc: TransformerContext
  ) => {
    if (getBaseType(definition.type) !== "Int") {
      throw new Error('Directive "ttl" must be used only on Int type fields.');
    }
  };
}
