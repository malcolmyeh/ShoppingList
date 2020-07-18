// wrapper for lambda functions
// returns Promise (coudl be async)

export default function handler(lambda) {
    return function (event, context) {
        return Promise.resolve()
            // Run the Lambda
            .then(() => lambda(event, context))
            // On success
            .then((responseBody) => [200, responseBody])
            // On failure
            .catch((e) => {
                console.log("error", e);
                return [500, { error: e.message }];
            })
            // Return HTTP response
            .then(([statusCode, body]) => ({
                statusCode,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify(body),
            }));
    };
}