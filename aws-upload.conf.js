module.exports = {
    credentials:"aws-credentials.json",
    bucketName:"s2ihs",
    patterns:[
        "*",
        "public/*",
        "scripts/*",
        "src/**/**/*",
        "config/*",
        "config/jest/*",
        "node_modules/****/***/**/*"
    ]
}
