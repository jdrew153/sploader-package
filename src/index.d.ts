import { TSploaderUploadHookRequest } from './path/to/TSploaderUploadHookRequest'; // Adjust the import path as per your actual file structure

export declare function useKaykatJDUploader(): {
    progress: number;
    fileUrl: string | null;
    isLoading: boolean;
    error: unknown | null;
    uploadFile: (data: TSploaderUploadHookRequest) => Promise<void>;
};
