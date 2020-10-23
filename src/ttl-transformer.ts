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
      throw new InvalidDirectiveError(
        'Directive "ttl" must be used only on Int type fields.'
      );
    }

    let numberOfTtlDirectivesInsideParentType = 0;
    if (parent.fields) {
      parent.fields.forEach((field) => {
        if (field.directives) {
          numberOfTtlDirectivesInsideParentType += field.directives.filter(
            (directive) => directive.name.value === "ttl"
          ).length;
        }
      });
    }
    if (numberOfTtlDirectivesInsideParentType > 1) {
      throw new InvalidDirectiveError(
        'Directive "ttl" must be used only once in the same type.'
      );
    }
  };
}
