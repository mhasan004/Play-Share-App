const AWS = require("aws-sdk")

AWS.config.update({                                                                                                     // Configure the keys for accessing AWS
    region: "us-east-2",                                                                                                // For DynamoDB
    endpoint: "http://localhost:8000",                                                                                   // For DynamoDB
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,                                                                         // For S3
    secretAccessKey: process.env.AWS_SECRET_KEY,                                                                        // For S3
});
const s3 = new AWS.S3()
const dynamodb = new AWS.DynamoDB();

//------------------------------------------------------------------------------------------ S3
const uploadFile = (filename, buffer, type) => {
    const params = {
        ACL: "public-read",
        Body: buffer,
        Bucket: process.env.S3_BUCKET_NAME,
        ContentType: type.mime,
        Key: `${filename}.${type.ext}`,
    };
    return s3.upload(params).promise();
};

async function S3Upload(filename, buffer, type) { 
    try {
        console.log("uploading")
        return await uploadFile(filename, buffer, type)
    } catch (err) {
        console.log("AWS S3 Error - Failed to upload to s3. Might have public access settings blocked on s3 bucket or s3 profile, have wrong auth keys, or CORS issues!! ---- Err: " + err);
        throw "Failed to upload to s3. Error: " + err
    }
}

//------------------------------------------------------------------------------------------ DynamoDB
// const params = {
//     TableName : "Play-Store-Refresh-Tokens",
//     KeySchema: [       
//         { AttributeName: "RefreshTokens", KeyType: "S"}, 
//     ],
//     AttributeDefinitions: [       
//         { AttributeName: "RefreshTokens", AttributeType: "S" }
//     ],
//     // ProvisionedThroughput: {       
//     //     ReadCapacityUnits: 10, 
//     //     WriteCapacityUnits: 10
//     // }
// };

// dynamodb.createTable(params, (err, data)=>{
//     if (err) 
//         console.error("AWS DynamoDB - Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
//     else 
//         console.log("AWS DynamoDB - Created table. Table description JSON:", JSON.stringify(data, null, 2));
// });




module.exports = {
    S3Upload,
    dynamodb
};
