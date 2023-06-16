
import { pool } from "../db.js";


//obtengo todas las boarding_pass del vuelo buscado, y sus pasajeros. 
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


//obtengo todos los asientos.
export const totalseats = async () => {
    const [totalSeats] = await pool.query(`Select * from seat`)

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
//obtengo lista de asientos ocupados y libres. 
export const seatoccuped = async (boardingpass, seats) => {

    for (let i = 0; i < boardingpass.length; i++) {
        if (boardingpass[i].seatId) {
            const index = Number(boardingpass[i].seatId)
            seats[index - 1].status = 1
        }
    }

    return seats
}

//agrupo por idpurchase
export const groupbypurchase = async (boardingpass) => {

    let grupos = {};

    boardingpass.forEach(pass => {
        const aux = pass.purchaseId;
        if (!grupos[aux]) grupos[aux] = [];
        grupos[aux].push(pass);


    })
    return grupos
}

//asigno asientos
export const assingseat = async (boardingpassGroup, seatsoccupped, idflight) => {

    const [purchaseids] = await pool.query(`SELECT purchase_id FROM boarding_pass WHERE flight_id= ? GROUP by purchase_id`, idflight)
    const [airplaneid] = await pool.query(`SELECT airplane_id FROM flight where flight_id = ?;`, idflight)


    for (let i = 0; i < purchaseids.length; i++) {
        const j = purchaseids[i].purchase_id
        if (boardingpassGroup[j].length > 1) {
            // si tienen mas de un pasaje comprado
            //console.log(boardingpassGroup[j], boardingpassGroup[j].length )

        } else {
            //si tiene un solo pasaje comprado
            console.log(boardingpassGroup[j][0] );
            if (!boardingpassGroup[j][0].seatId ) {
                console.log("hay j ", j);
                const freeseatid = await searchfreeseat(boardingpassGroup[j][0].seatTypeId, seatsoccupped, airplaneid[0].airplane_id)
                if (freeseatid) {
                    // si hay lugar asingo. 
                    console.log("free ", freeseatid);
                    boardingpassGroup[j][0].seatId = freeseatid
                } else {
                    // si no hay lugar y es clase 1 busco en clase 2
                    if (boardingpassGroup[j][0].seatTypeId=== 1 || boardingpassGroup[j][0].seatTypeId=== 2 ) {
                        const freeseatid2 = await searchfreeseat(2, seatsoccupped, airplaneid[0].airplane_id)
                        if (freeseatid2) {
                            console.log("free ", freeseatid2);
                            boardingpassGroup[j][0].seatId = freeseatid2 
                        } else {
                            const freeseatid3 = await searchfreeseat(2, seatsoccupped, airplaneid[0].airplane_id)
                            if (freeseatid3) {
                                console.log("free ", freeseatid3);
                                boardingpassGroup[j][0].seatId = freeseatid3 

                            }
                        }

                    }
                }

            }

        }

    }

    return boardingpassGroup

}

//buscar el primer asiento libre que encuentra
async function searchfreeseat(seattypeid, seatsoccupped, airplaneid) {
    for (let x = 0; x < seatsoccupped.length; x++) {

        if (seatsoccupped[x].airplane_id === airplaneid && seatsoccupped[x].seat_type_id === seattypeid && seatsoccupped[x].status === 0) {

            seatsoccupped[x].status = 1
            return seatsoccupped[x].seat_id

        } 

    }


}