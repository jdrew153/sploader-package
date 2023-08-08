import axios, {AxiosError} from "axios";
import {TFileUploadChunkRequest} from "../validators";
import {FileUrlAndSize, HandleResizeImage} from "./resizing";

export const axiosChunker = async ({blob, fileId, fileType, callback, apiKey}: TFileUploadChunkRequest): Promise<FileUrlAndSize[] | string | undefined> => {

    if (fileType.includes("/")) {
        fileType = fileType.split("/")[1];
    }

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


            let res = await axios.post(`https://kaykatjd.com/download?ext=${fileType}&currChunk=${currentChunk}&totalChunks=${
                totalChunks - 1
            }&fileName=${'joshie' + '_' + fileId}&fileId=${fileId}&totalSize=${
                blob.size
            }&remote=true`, formData)

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


    if (fileType.includes(".mp4")) {
        return `https://kaykatjd.com/media/joshie_${fileId}.${fileType}`
    }

    const resizedImageUrls = await HandleResizeImage(`joshie_${fileId}.${fileType}`);

   if (resizedImageUrls) {
       return resizedImageUrls;
   }
};





