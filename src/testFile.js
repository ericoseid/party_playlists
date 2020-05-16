"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var S3ObjectRetrieverDefaultImpl_1 = __importDefault(require("./external/s3/impl/S3ObjectRetrieverDefaultImpl"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var AppConfig_1 = __importDefault(require("./config/AppConfig"));
var s3 = new aws_sdk_1.default.S3();
var s3Retriever = new S3ObjectRetrieverDefaultImpl_1.default(s3);
AppConfig_1.default.initializeFromS3(s3Retriever).then(function () {
    console.log(AppConfig_1.default.getConfig());
});
