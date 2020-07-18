import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.inventoryTableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      itemId: event.pathParameters.id
    }
  };
  const result = await dynamoDb.get(params);
  if ( ! result.Item) {
    throw new Error("Item not found.");
  }
  return result.Item;
});
