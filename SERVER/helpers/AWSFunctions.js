const AWS = require("aws-sdk")

AWS.config.update({                                                                         // Configure the keys for accessing AWS
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});
const s3 = new AWS.S3()

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

module.exports = {
    S3Upload,
};
