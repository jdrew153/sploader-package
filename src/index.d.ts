import { TSploaderUploadHookRequest } from './path/to/TSploaderUploadHookRequest'; // Adjust the import path as per your actual file structure

declare const useKaykatJDUploader: () => {
    progress: number;
    fileUrl: string | null;
    isLoading: boolean;
    error: unknown | null;
    uploadFile: (data: TSploaderUploadHookRequest) => Promise<void>;
};



declare module "sploader-package" {
    export default useKaykatJDUploader;
}
