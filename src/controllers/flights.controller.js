import { pool } from "../db.js";
import {
    getboardingpass,
    seats_free,
    totalseats,
    groupbypurchase,
    assingseat
} from '../services/index.services.js'


export const flights = async (req, res) => {
    try {
        const idflight = Number(req.params.id)
        const [rows] = await pool.query(`SELECT flight_id AS flightId, takeoff_date_time AS takeoffDateTime, 
    takeoff_airport AS takeoffAirport, landing_date_time AS landingDateTime, landing_airport AS landingAirPort ,
     airplane_id AS airplaneID  from flight WHERE flight_id = ?`, idflight)

        if (rows.length < 1) { return res.status(404).json({ message: 'Vuelo no encontrado' }); }

        const boardingpass = await getboardingpass(idflight)

        const seats = await totalseats(idflight) 

        const seatsfree = await seats_free(boardingpass, seats, idflight) 

        const boardingpassGroup = await groupbypurchase(boardingpass) 

        const assingseats = await assingseat(boardingpassGroup, seatsfree, idflight) 

        const result = {
            code: 200,
            data: rows[0],
            passengers: assingseats
        }
        res.json(result)    

    } catch (error) {
        return res.status(500).json({ error: 'Something was wrong', error })
        
    }
}