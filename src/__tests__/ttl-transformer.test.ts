import { EOL } from 'node:os'
import { GraphQLTransform } from '@aws-amplify/graphql-transformer-core'
import { ModelTransformer } from '@aws-amplify/graphql-model-transformer'
import { ModelResourceIDs } from 'graphql-transformer-common'
import TtlTransformer from '../index'

test('@ttl directive can be used on fields', () => {
  const schema = `
    type ExpiringChatMessage @model {
      id: ID!
      message: String
      expirationUnixTime: AWSTimestamp! @ttl
    }
  `
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new TtlTransformer()],
  })
  expect(() => transformer.transform(schema)).not.toThrow()
})

test('@ttl directive can not be used on types', () => {
  const schema = `
    type ExpiringChatMessage @model @ttl {
      id: ID!
      message: String
      expirationUnixTime: AWSTimestamp!
    }
  `
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new TtlTransformer()],
  })
  expect(() => transformer.transform(schema)).toThrowError(
    /Directive "@ttl" may not be used on OBJECT\./
  )
})

test('@ttl directive can not be used on fields other than Int and AWSTimestamp', () => {
  const schema = `
    type ExpiringChatMessage @model {
      id: ID!
      message: String
      expirationUnixTime: String! @ttl
    }
  `
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new TtlTransformer()],
  })
  expect(() => transformer.transform(schema)).toThrowError(
    'Directive "ttl" must be used only on AWSTimestamp or Int type fields.'
  )
})

test('@ttl directive can be used on fields with AWSTimestamp type', () => {
  const schema = `
    type ExpiringChatMessage @model {
      id: ID!
      message: String
      expirationUnixTime: AWSTimestamp! @ttl
    }
  `
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new TtlTransformer()],
  })
  expect(() => transformer.transform(schema)).not.toThrow()
})

test('@ttl directive can be used on fields with Int type', () => {
  const schema = `
    type ExpiringChatMessage @model {
      id: ID!
      message: String
      expirationUnixTime: Int! @ttl
    }
  `
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new TtlTransformer()],
  })
  expect(() => transformer.transform(schema)).not.toThrow()
})

test('Only one @ttl directive per type is allowed', () => {
  const schema = `
      type ExpiringChatMessage @model {
        id: ID!
        message: String
        expirationUnixTime: AWSTimestamp! @ttl
        anotherExpirationUnixTime: AWSTimestamp! @ttl
      }
    `
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new TtlTransformer()],
  })
  expect(() => transformer.transform(schema)).toThrowError(
    'Directive "ttl" must be used only once in the same type.'
  )
})

const getPropertiesOfSchemaTable = (schema: string, schemaTypeName: string) => {
  const tableName = ModelResourceIDs.ModelTableResourceID(schemaTypeName)
  const transformer = new GraphQLTransform({
    transformers: [new ModelTransformer(), new TtlTransformer()],
  })
  const resources =
    transformer.transform(schema).stacks[schemaTypeName].Resources
  if (!resources) {
    throw new Error('Expected to have resources in the stack')
  }
  const table = resources[tableName]
  if (!table) {
    throw new Error(
      `Expected to have a table resource called ${tableName} in the stack`
    )
  }
  const properties = table.Properties
  if (!properties) {
    throw new Error(`Expected to have a properties in table ${tableName}`)
  }
  return properties
}

test('Generated CloudFormation document contains the TimeToLiveSpecification property', () => {
  const schema = `
    type ExpiringChatMessage @model {
      id: ID!
      message: String
      expirationUnixTime: AWSTimestamp! @ttl
    }
  `
  const properties = getPropertiesOfSchemaTable(schema, 'ExpiringChatMessage')
  const timeToLiveSpecificationProperty = properties['TimeToLiveSpecification']
  expect(timeToLiveSpecificationProperty).toBeDefined()
})

test('TimeToLiveSpecification property is pointing to the field where the @ttl directive was used', () => {
  const schema = `
    type ExpiringChatMessage @model {
      id: ID!
      message: String
      expirationUnixTime: AWSTimestamp! @ttl
    }
  `
  const properties = getPropertiesOfSchemaTable(schema, 'ExpiringChatMessage')
  const timeToLiveSpecificationProperty = properties['TimeToLiveSpecification']
  expect(timeToLiveSpecificationProperty.AttributeName).toEqual(
    'expirationUnixTime'
  )
})
