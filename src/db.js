import { createPool } from "mysql2/promise";
import {
 USER,
 PASS,
 DATABASE,
 HOST
} from './config.js'

export const pool = createPool({
        user: USER,
        password: PASS,
        database: DATABASE,
        host: HOST
})