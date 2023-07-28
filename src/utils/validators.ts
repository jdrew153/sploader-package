import {z} from "zod";


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
        callback: z.function().args(z.number()).returns(z.void()).optional()
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



