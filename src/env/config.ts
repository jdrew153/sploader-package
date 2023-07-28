import zenv from 'zennv'
import {z} from "zod";


export const env = zenv({
    dotenv: true,
    schema: z.object({
        SPLOADER_API_KEY: z.string().nonempty({
            message: "SPLOADER_API_KEY is required"
        }),
    })
});
