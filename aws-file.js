var AWS = require('aws-sdk');
AWS.config.update({
  "accessKeyId": "AKIAJSYLV2VNXOJ6SATQ",
  "secretAccessKey": "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",
  "region": "eu-central-1"
});

// Create an S3 client
var s3 = new AWS.S3();

// Create a bucket and upload something into it
var bucketName = 'ihs2s';
var keyName = 'hello_world.txt';

s3.createBucket({Bucket: bucketName}, function() {
  var params = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
  s3.putObject(params, function(err, data) {
    if (err)
      console.log(err)
    else
      console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
  });
});
