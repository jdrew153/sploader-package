
type UploadFileFn = {
    uploadFile: (data: TSploaderUploadHookRequest, onProgress?: TCallbackFunction) => Promise<string>
}

type TSploaderCallbackFunction = (progress: number) => void;

const useKaykatJDUploader = (): UploadFileFn => {

    if (!process.env.SPLOADER_API_KEY) {
       console.warn("SPLOADER_API_KEY is required");
    }

   const uploadFile = async (data: TSploaderUploadHookRequest, onProgress?: TCallbackFunction) => {


       const updateProgress = (progress: number) => {

           if (onProgress) {
               onProgress(progress);
           } else {
               console.warn("No progress is available to be provided")
           }
       }

       const callback = (progress: number) => {
           updateProgress(progress * 100);
       }

       return await axiosChunker({
           blob: data.blob,
           fileId: data.uploadId,
           fileType: data.fileType,
           callback: callback,
           apiKey: process.env.SPLOADER_API_KEY!
       }) as string;
   }

    return {
       uploadFile
    }
};


interface TSploaderCallbackFunctionModel {
    onProgress?: TSploaderCallbackFunction
}

// Custom parser for callback function of type TCallbackFunction
function callbackFunctionParser(onProgress: unknown) : TSploaderCallbackFunction | unknown {
    if (typeof onProgress === "function") {
        return onProgress as TSploaderCallbackFunction;
    } else {
        throw new Error("onProgress must be a function");
    }
}

export default useKaykatJDUploader;

import {z} from "zod";

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



import axios from "axios";

export const axiosChunker = async ({ blob, fileId, fileType, callback, apiKey } : TFileUploadChunkRequest) => {

    const chunkSize = 5 * 1024 * 1024; // 5MB

    console.log('blob size', blob.size);

    const totalChunks = Math.ceil(blob.size / chunkSize);

    console.log('totalChunks', totalChunks);

    let currentChunk = 0;

    let totalWritten = 0;

    let start = 0;

    let end = chunkSize;

    const apiKeyHeaderValue = apiKey as string;

    while (start < blob.size) {
        const dataSlice = blob.slice(start, end);

        const formData = new FormData();

        formData.append('file', dataSlice, `test_${fileId}`);
        formData.append('apiKey', apiKeyHeaderValue);

        let res = await axios.post( `https://kaykatjd.com/download?ext=${fileType}&currChunk=${currentChunk}&totalChunks=${
                    totalChunks - 1
                }&fileName=${'joshie' + '_' + fileId}&fileId=${fileId}&totalSize=${
                    blob.size
                }`, formData)

        console.log(res.data);

        totalWritten += dataSlice.size;

        currentChunk++;

        start = end;
        end = start + chunkSize;

        console.log('curr chunk', currentChunk);
        console.log('totalWritten', totalWritten);
        console.log('progress', totalWritten / blob.size);

        if (callback) {
            callback(totalWritten / blob.size);
        }
    }

    return `https://kaykatjd.com/media/joshie_${fileId}.${fileType}`;
};





