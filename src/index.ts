import {useState} from 'react'




const useKaykatJDUploader = () => {
    const [progress, setProgress] = useState(0);
    const [fileUrl, setFileUrl] = useState<string |null>(null );
    const [isLoading, setIsLoading] = useState(false);

    const mutateAsync = async (data: TSploaderUploadHookRequest) => {
        const blobType = data.blob as any
        if (!(blobType instanceof Blob) || !data.blob) {
            throw new Error('Blob must be set to make the request')
        }

        if (!process.env.SPLOADER_API_KEY) {
            throw new Error('API Key must be set to make the request')
        }

        axiosChunker({
            blob: data.blob,
            fileType: data.fileType,
            apiKey: process.env.SPLOADER_API_KEY,
            fileId: data.uploadId,
            callback: (progress: number) => {
                setProgress(progress * 100)
            }
        })
            .catch((error) => {
                throw new Error(error)
            })
            .then((data) => {

                if (!data) {
                    throw new Error('Something went wrong while uploading your file.. ')
                }
                return data
            })
    }
}

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

    // const headers: AxiosRequestConfig<FormData>['headers'] = {
    //     'x-api-key': apiKey,
    // };

    while (start < blob.size) {
        const dataSlice = blob.slice(start, end);

        const formData = new FormData();

        formData.append('file', dataSlice, `test_${fileId}`);

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


