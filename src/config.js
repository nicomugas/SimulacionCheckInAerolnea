import { config } from "dotenv";
config();

export const PORT = process.env.PORT
export const USER = process.env.USER
export const PASS = process.env.PASS
export const DATABASE = process.env.DATABASE
export const HOST = process.env.HOST