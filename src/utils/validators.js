"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SploaderUploadHookRequest = exports.FileUploadChunkRequest = void 0;
const zod_1 = require("zod");
exports.FileUploadChunkRequest = zod_1.z.object({
    blob: zod_1.z.any(),
    fileType: zod_1.z.string().nonempty({
        message: "fileType is required"
    }),
    fileId: zod_1.z.string().nonempty({
        message: "fileId is required"
    }),
    apiKey: zod_1.z.string().nonempty({
        message: "apiKey is required"
    }),
    callback: zod_1.z.function().args(zod_1.z.number()).returns(zod_1.z.void()).optional()
});
exports.SploaderUploadHookRequest = zod_1.z.object({
    uploadId: zod_1.z.string().nonempty({
        message: "fileId is required"
    }),
    fileType: zod_1.z.string().nonempty({
        message: "fileType is required"
    }),
    blob: zod_1.z.any(),
});
