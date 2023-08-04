import {SploaderUploadHookRequest, TCallbackFunction, TSploaderUploadHookRequest, UploadFileFn} from "./validators";
import {axiosChunker} from "./utils/chunking";
import {ZodError} from "zod";


export default class Sploader {
    apiKey: string | undefined;
    constructor() {
        this.apiKey = process.env.SPLOADER_API_KEY;
    }

    useKaykatJDUploader = (): UploadFileFn | undefined => {
        try {
            const uploadFile = async (data: TSploaderUploadHookRequest, onProgress?: TCallbackFunction) => {

                const validData = SploaderUploadHookRequest.parse(data);

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
                    blob: validData.blob,
                    fileId: validData.uploadId,
                    fileType: validData.fileType,
                    callback: callback,
                    apiKey: this.apiKey!
                }) as unknown as string;
            }

            return {
                uploadFile
            }
        } catch (e) {
            if (e instanceof ZodError) {
                throw new Error(e.message);
            } else {
                console.log(e)
                throw new Error("Something went wrong...");
            }
        }
    }
}





