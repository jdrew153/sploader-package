import {z} from "zod";
import {FileUrlAndSize} from "../utils/resizing";

const CallbackFunction = z.function().args(z.number()).returns(z.number()).optional();

export type TCallbackFunction = z.infer<typeof CallbackFunction>;

export const FileUploadChunkRequest = z.object({
    blob: z.any(),
    fileType: z.string().nonempty({
        message: "fileType is required"
    }),
    fileId: z.string().nonempty({
        message: "fileId is required"
    }),
    apiKey: z.string().nonempty({
        message: "apiKey is required"
    }),
    callback: z.any()
});


export type TFileUploadChunkRequest = z.infer<typeof FileUploadChunkRequest>;


export const SploaderUploadHookRequest = z.object({
    uploadId: z.string().nonempty({
        message: "fileId is required"
    }),
    fileType: z.string().nonempty({
        message: "fileType is required"
    }),
    blob: z.any(),
});

export type TSploaderUploadHookRequest = z.infer<typeof SploaderUploadHookRequest>;


export type UploadFileFn = {
    uploadFile: (data: TSploaderUploadHookRequest, onProgress?: TCallbackFunction) => Promise<FileUrlAndSize[]>
}

