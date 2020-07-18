import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'itemId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      itemId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET itemName = :itemName, picture = :picture, quantity = :quantity, units = :units, alternative = :alternative, notes = :notes",
    ExpressionAttributeValues: {
      // ":attachment": data.attachment || null,
      // ":content": data.content || null
      ":itemName" : data.itemName || null,
      ":picture" : data.picture || null,
      ":quantity" : data.quantity || null,
      ":units" : data.units || null,
      ":alternative" : data.alternative || null,
      ":notes" : data.notes || null,
      ":category": data.category || null

    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});