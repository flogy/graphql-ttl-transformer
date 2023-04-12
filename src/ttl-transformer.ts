import {
  InvalidDirectiveError,
  TransformerPluginBase,
} from "@aws-amplify/graphql-transformer-core";
import {
  DirectiveNode,
  ObjectTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  FieldDefinitionNode,
} from "graphql";
import { getBaseType, ModelResourceIDs } from "graphql-transformer-common";
import { Table, CfnTable } from "aws-cdk-lib/aws-dynamodb";
import { DynamoDbDataSource } from "aws-cdk-lib/aws-appsync";
import type {
  TransformerContextProvider,
  TransformerSchemaVisitStepContextProvider,
} from "@aws-amplify/graphql-transformer-interfaces";
import type { IConstruct } from "constructs";

export class TtlTransformer extends TransformerPluginBase {
  private readonly ttlFields: Map<
    ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode,
    string
  > = new Map();

  constructor() {
    super("TtlTransformer", "directive @ttl on FIELD_DEFINITION");
  }

  public field = (
    parent: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode,
    definition: FieldDefinitionNode,
    directive: DirectiveNode,
    acc: TransformerSchemaVisitStepContextProvider
  ) => {
    if (!["AWSTimestamp", "Int"].includes(getBaseType(definition.type))) {
      throw new InvalidDirectiveError(
        'Directive "ttl" must be used only on AWSTimestamp or Int type fields.'
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

    const fieldName = definition.name.value;
    this.ttlFields.set(parent, fieldName);
  };

  public generateResolvers = (ctx: TransformerContextProvider): void => {
    this.ttlFields.forEach((fieldName, parent) => {
      const ddbTable = this.getTable(ctx, parent as ObjectTypeDefinitionNode) as Table;
      (ddbTable["table"] as CfnTable).timeToLiveSpecification = {
        attributeName: fieldName,
        enabled: true,
      };
    });
  };

  private getTable = (
    context: TransformerContextProvider,
    definition: ObjectTypeDefinitionNode
  ): IConstruct => {
    const ddbDataSource = context.dataSources.get(
      definition
    ) as DynamoDbDataSource;
    const tableName = ModelResourceIDs.ModelTableResourceID(
      definition.name.value
    );
    const table = ddbDataSource.ds.stack.node.findChild(tableName);
    return table;
  };
}
