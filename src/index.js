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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosChunker = void 0;
const axios_1 = __importDefault(require("axios"));
const axiosChunker = ({ blob, fileId, fileType, callback, apiKey }) => __awaiter(void 0, void 0, void 0, function* () {
    const chunkSize = 5 * 1024 * 1024; // 5MB
    console.log('blob size', blob.size);
    const totalChunks = Math.ceil(blob.size / chunkSize);
    console.log('totalChunks', totalChunks);
    let currentChunk = 0;
    let totalWritten = 0;
    let start = 0;
    let end = chunkSize;
    while (start < blob.size) {
        const dataSlice = blob.slice(start, end);
        const formData = new FormData();
        formData.append('file', dataSlice, `test_${fileId}`);
        let res = yield axios_1.default.post(`https://kaykatjd.com/download?ext=${fileType}&currChunk=${currentChunk}&totalChunks=${totalChunks - 1}&fileName=${'joshie' + '_' + fileId}&fileId=${fileId}&totalSize=${blob.size}`, formData, {
            headers: {
                'x-api-key': apiKey,
            }
        });
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
});
exports.axiosChunker = axiosChunker;
