import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.inventoryTableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      itemId: uuid.v1(),
      itemName: data.itemName,
      quantity: data.quantity,
      units: data.units,
      category: data.category
    }
  };
  await dynamoDb.put(params);
  return params.Item;
});