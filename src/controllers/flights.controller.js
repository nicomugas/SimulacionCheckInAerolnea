import { pool } from "../db.js";
import {
    getboardingpass,
    seatoccuped,
    totalseats,
    groupbypurchase,
    assingseat
} from '../services/index.js'

// Devuelve datos de vuelo con pasajeros. 
export const flights = async (req, res) => {
    try {
        const idflight = Number(req.params.id)
        const [rows] = await pool.query(`SELECT flight_id AS flightId, takeoff_date_time AS takeoffDateTime, 
    takeoff_airport AS takeoffAirport, landing_date_time AS landingDateTime, landing_airport AS landingAirPort ,
     airplane_id AS airplaneID  from flight WHERE flight_id = ?`, idflight)

        if (rows.length < 1) { return res.status(404).json({ message: 'Vuelo no encontrado' }); }

        const boardingpass = await getboardingpass(idflight)


        const seats = await totalseats() //obtengo la totalidad de  los asientos.

        const seatsoccupped = await seatoccuped(boardingpass, seats) //obtengo lista de asientos ocupados y libres

        const boardingpassGroup = await groupbypurchase(boardingpass) // agrupo por compra

        const assingseats = await assingseat(boardingpassGroup, seatsoccupped, idflight) //asigno los asientos




        const result = {
            code: 200,
            data: rows[0],
            passengers: boardingpass
        }
        res.json(assingseats)
        //res.json("hola")

    } catch (error) {
        return res.status(500).json({ error: 'Something was wrong', error })
        //return error
    }
}