


type ProgressCallback = (progress: number) => number;
type UploadFileFn = {
    uploadFile: (data: TSploaderUploadHookRequest, onProgress?: ProgressCallback) => Promise<string>
}

const useKaykatJDUploader = (): UploadFileFn => {


   const uploadFile = async (data: TSploaderUploadHookRequest, onProgress?: (progress: number) => number) => {

       const updateProgress = (progress: number) => {
           if (onProgress) {
               onProgress(progress);
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
           apiKey: process.env.SPLOADER_API_KEY || ''
       }) as string;
   }

    return {
       uploadFile
    }

};

export default useKaykatJDUploader;


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



import axios, {AxiosRequestConfig} from "axios";

export const axiosChunker = async ({ blob, fileId, fileType, callback, apiKey } : TFileUploadChunkRequest) => {

    const chunkSize = 5 * 1024 * 1024; // 5MB

    console.log('blob size', blob.size);

    const totalChunks = Math.ceil(blob.size / chunkSize);

    console.log('totalChunks', totalChunks);

    let currentChunk = 0;

    let totalWritten = 0;

    let start = 0;

    let end = chunkSize;

    const apiKeyHeaderValue = apiKey as string
    ;


    const config: AxiosRequestConfig<FormData> = {
        headers: {
              'x-api-key': apiKeyHeaderValue,
        }
    }

    while (start < blob.size) {
        const dataSlice = blob.slice(start, end);

        const formData = new FormData();

        formData.append('file', dataSlice, `test_${fileId}`);

        //@ts-ignore
        let res = await axios.post(
            `https://kaykatjd.com/download?ext=${fileType}&currChunk=${currentChunk}&totalChunks=${
                totalChunks - 1
            }&fileName=${'joshie' + '_' + fileId}&fileId=${fileId}&totalSize=${
                blob.size
            }`,
            formData,
        );

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


