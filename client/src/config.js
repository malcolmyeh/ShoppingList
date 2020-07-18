export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "malcolm-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://3p0ts5laug.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_CiU3BzeO0",
    APP_CLIENT_ID: "11nv7q37ll1882bft5nhdue30d",
    IDENTITY_POOL_ID: "us-east-1:9588b5c7-a409-432a-b294-bcc9d1dfd8bf"
  }
};