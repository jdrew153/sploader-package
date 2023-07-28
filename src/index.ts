import {TSploaderUploadHookRequest} from "./utils/validators";


import {useEffect, useState} from "react";

import {env} from "./env/config";
import {axiosChunker} from "./utils/chunker";




const useKaykatJDUploader = () => {

    const [progress, setProgress] = useState(0);
    const [fileUrl, setFileUrl] = useState<string |null>(null );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const mutateAsync = async (data: TSploaderUploadHookRequest) => {
        const blobType = data.blob as any
        if (!(blobType instanceof Blob) || !data.blob) {
            throw new Error('Blob must be set to make the request')
        }
        axiosChunker({
            blob: data.blob,
            fileType: data.fileType,
            apiKey: env.SPLOADER_API_KEY,
            fileId: data.uploadId,
            callback: (progress) => {
                setProgress(progress * 100)
            }
        })
            .catch((error) => {
                setError(error)
            })
            .then((data) => {

                if (!data) {
                    throw new Error('Something went wrong while uploading your file.. ')
                }
                setFileUrl(data)
            })
    }


    useEffect(() => {

        return () => {
            setProgress(0)
            setFileUrl(null)
            setIsLoading(false)
        }
    }, []);

    return {
        progress,
        fileUrl,
        isLoading,
        error,
        uploadFile: mutateAsync
    }
};

export default useKaykatJDUploader;

