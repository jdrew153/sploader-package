import {SploaderUploadHookRequest, TCallbackFunction, TSploaderUploadHookRequest, UploadFileFn} from "./validators";
import {axiosChunker} from "./utils/chunking";
import {ZodError} from "zod";
import {FileUrlAndSize} from "./utils/resizing";


export default class Sploader {
    apiKey: string | undefined;
    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    useKaykatJDUploader = (): UploadFileFn  => {

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
                }) as unknown as FileUrlAndSize[];
            }

            return {
                uploadFile
            }
    }
}





