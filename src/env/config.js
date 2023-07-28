"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zennv_1 = __importDefault(require("zennv"));
const zod_1 = require("zod");
exports.env = (0, zennv_1.default)({
    dotenv: true,
    schema: zod_1.z.object({
        SPLOADER_API_KEY: zod_1.z.string().nonempty({
            message: "SPLOADER_API_KEY is required"
        }),
    })
});
