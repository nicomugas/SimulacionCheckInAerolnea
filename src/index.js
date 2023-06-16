import expres  from "express";

import checkinroutes from './routes/checkin.routes.js'
import {PORT} from './config.js'

const app = expres();

app.use(checkinroutes)





app.listen(PORT)
console.log("app listen on PORT", PORT);