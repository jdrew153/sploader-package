import axios, {AxiosError} from "axios";

export async function HandleResizeImage(filePath: string): Promise<string[] | undefined> {
    try {
        const res = await axios.post('https://kaykatjd.com/resize', {
            filePath: filePath
        });
        return res.data as string[];
    } catch (e) {
        if (e instanceof AxiosError) {
           throw new Error(e.message);
        } else {
            console.warn(e)
            throw new Error("Something went wrong...");
        }
    }
}
