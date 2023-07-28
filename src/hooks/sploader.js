"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const index_1 = require("../index");
const config_1 = require("../env/config");
const useKaykatJDUploader = () => {
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [fileUrl, setFileUrl] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const mutateAsync = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const blobType = data.blob;
        if (!(blobType instanceof Blob) || !data.blob) {
            throw new Error('Blob must be set to make the request');
        }
        yield (0, index_1.axiosChunker)({
            blob: data.blob,
            fileType: data.fileType,
            apiKey: config_1.env.SPLOADER_API_KEY,
            fileId: data.uploadId,
            callback: (progress) => {
                setProgress(progress * 100);
            }
        });
    });
    (0, react_1.useEffect)(() => {
        return () => {
            setProgress(0);
            setFileUrl(null);
            setIsLoading(false);
        };
    }, []);
    return {
        progress,
        fileUrl,
        isLoading,
        error,
        uploadFile: mutateAsync
    };
};
exports.default = useKaykatJDUploader;
