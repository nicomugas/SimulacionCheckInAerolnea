import { pool } from "../db.js";
import {
    locate_passengers_with_minors,
    locate_passengers_groups,
    seat_unique_passengers
} from "./searchseat.services.js"


export const getboardingpass = async (flightid) => {
    const [boarding_pass] = await pool.query(`SELECT  
    BP.passenger_id AS passengerId,
    P.dni,
    P.name,
    P.age,
    P.country,
    BP.boarding_pass_id AS boardinPassId,
    BP.purchase_id AS purchaseId,
    BP.seat_type_id AS seatTypeId,
    BP.seat_id AS seatId
    
    from boarding_pass AS BP
    INNER JOIN passenger AS P ON BP.passenger_id = P.passenger_id
    WHERE BP.flight_id = ?
    ORDER BY BP.purchase_id`, flightid)

    return boarding_pass;
}



export const totalseats = async (idflight) => {
    const [airplaneid] = await pool.query(`SELECT airplane_id FROM flight where flight_id = ?`, idflight)
    const [totalSeats] = await pool.query(`Select * from seat  where airplane_id = ?`, airplaneid[0].airplane_id)
    const result = []
    for (let i = 0; i < totalSeats.length; i++) {
        result.push({
            seat_id: totalSeats[i].seat_id,
            seat_column: totalSeats[i].seat_column,
            seat_row: totalSeats[i].seat_row,
            seat_type_id: totalSeats[i].seat_type_id,
            airplane_id: totalSeats[i].airplane_id,
            status: 0
        }
        )
    }
    return result;
}

export const seats_free = async (boardingpass, seats) => {
    const freeseatbyclass = {
        class1: [],
        class2: [],
        class3: []
    }
    const seatstodelete = []
    for (let i = 0; i < boardingpass.length; i++) {
        if (boardingpass[i].seatId) {
            seatstodelete.push(boardingpass[i].seatId)
        }
    }
    const freeseat = await delete_seat(seatstodelete, seats)
    for (let k = 0; k < freeseat.length; k++) {
        switch (Number(freeseat[k].seat_type_id)) {
            case 1:
                freeseatbyclass.class1.push(freeseat[k])
                break;
            case 2:
                freeseatbyclass.class2.push(freeseat[k])
                break;
            default:
                freeseatbyclass.class3.push(freeseat[k])
                break;
        }
    }
    return freeseatbyclass
}

export async function delete_seat(seatstodelete, seats) {

    for (let j = 0; j < seatstodelete.length; j++) {
        for (let i = 0; i < seats.length; i++) {
            if (seatstodelete[j] === seats[i].seat_id) {
                seats.splice(i, 1)
                break
            }
        }
    }
    return seats
}

export const groupbypurchase = async (boardingpass) => {
    let grupos = {};
    boardingpass.forEach(pass => {
        const aux = pass.purchaseId;
        if (!grupos[aux]) grupos[aux] = [];
        grupos[aux].push(pass);
    })
    return grupos
}

export const assingseat = async (boardingpassGroup, seatsfree, idflight) => {
    const [purchaseids] = await pool.query(`SELECT purchase_id FROM boarding_pass WHERE flight_id= ? GROUP by purchase_id`, idflight)
    const [airplaneid] = await pool.query(`SELECT airplane_id FROM flight where flight_id = ?;`, idflight)

    const purchaseswithminor = await group_purchases_by_age(boardingpassGroup, purchaseids, -18)
    const purchasewithoutminor = await group_purchases_by_age(boardingpassGroup, purchaseids, 18)
    const uniquepassengers = await group_by_unique_passenger(boardingpassGroup, purchaseids)

    await locate_passengers_with_minors(purchaseswithminor, seatsfree, airplaneid[0].airplane_id)
    await locate_passengers_groups(purchasewithoutminor, seatsfree, airplaneid[0].airplane_id)
    await seat_unique_passengers(uniquepassengers, seatsfree, airplaneid[0].airplane_id)
    const flypassengers = purchaseswithminor.concat(purchasewithoutminor).concat(uniquepassengers)

    return flypassengers
}



async function group_purchases_by_age(boardingpassGroup, purchaseids, edad) {
    const purchasesbyage = []
    for (let i = 0; i < purchaseids.length; i++) {
        const j = purchaseids[i].purchase_id
        if (boardingpassGroup[j].length > 1) {
            let itsminor = false
            for (let x = 0; x < boardingpassGroup[j].length; x++) {
                if (boardingpassGroup[j][x].age < 18) {
                    itsminor = true
                }
            }
            if (edad === -18) {
                if (itsminor) purchasesbyage.push(boardingpassGroup[j])
            }
            if (edad === 18) {
                if (!itsminor) purchasesbyage.push(boardingpassGroup[j])
            }
        }
    }
    return purchasesbyage
}


async function group_by_unique_passenger(boardingpassGroup, purchaseids) {
    const uniquespassengers = []
    for (let i = 0; i < purchaseids.length; i++) {
        const j = purchaseids[i].purchase_id
        if (boardingpassGroup[j].length < 2) {
            uniquespassengers.push(boardingpassGroup[j])
        }
    }
    return uniquespassengers
}


