

//funcion que ubica a las compra de pasajeros que tienen menores. 
export const locate_passengers_with_minors = async (listpassengers, listseatsfree, airplaneid) => {


    console.log("arriba", listseatsfree.class2.length);
    //iteracion de todos los pasajeros
    for (let i = 0; i < listpassengers.length; i++) {
        const numberofpassengers = listpassengers[i].length
        const numberofminors = await countminors(listpassengers[i]);


        // iteracion por orden de compra. 
        for (let x = 0; x < listpassengers[i].length; x++) {

            // busco primer asiento libre
            const firstseatfree = await search_first_free_seat(listpassengers[i][x].seatTypeId, listseatsfree, airplaneid)

            if (firstseatfree) {
                // busco asiento de al lado para menor.
                const rightseat = await search_right_seat(listpassengers[i][x].seatTypeId, firstseatfree, listseatsfree)

                const leftseat = await search_left_seat(listpassengers[i][x].seatTypeId, firstseatfree, listseatsfree)

                const frontseat = await search_front_seat(listpassengers[i][x].seatTypeId, firstseatfree, listseatsfree)

                const backseat = await search_back_seat(listpassengers[i][x].seatTypeId, firstseatfree, listseatsfree)

                const frontseatleft = await search_front_seat_left(listpassengers[i][x].seatTypeId, firstseatfree, listseatsfree)

            }
            console.log("esete es el primer asiento", firstseatfree);



        }



    }

}

//funcion que devuelve pasajeros menores de 18 años. 
async function countminors(passengers) {
    const result = passengers.filter(p => p.age < 18)
    return result.length
}

//funcion que devuelve el primer asiento libre que encuentre 
async function search_first_free_seat(seattypeid, seatsfree, airplaneid) {
    var seattype = await search_seat_type_id(seattypeid, seatsfree)
    const firstfreeseat = seattype.find(seat => seat.airplane_id === airplaneid && seat.seat_type_id === seattypeid)
    return firstfreeseat;
}

//funcion que busca si hay asiento libre a la DERECHA y lo devuelve.
async function search_right_seat(seattypeid, seat, seatsfree) {
    var seattype = await search_seat_type_id(seattypeid, seatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    const rightseat = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) + 1) &&
        seat.seat_row === seatrow)
    return rightseat
}

//funcion que busca si hay asiento libre a la IZQUIERDA y lo devuelve.
async function search_left_seat(seattypeid, seat, seatsfree) {
    var seattype = await search_seat_type_id(seattypeid, seatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    const leftseat = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) - 1) &&
        seat.seat_row === seatrow)
    return leftseat
}



//funcion que busca si hay asiento libre ADELANTE y lo devuelve.
async function search_front_seat(seattypeid, seat, seatsfree) {
    var seattype = await search_seat_type_id(seattypeid, seatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    const frontseat = seattype.find(seat => seat.seat_column === seatcolumn &&
        seat.seat_row === seatrow -1 )      
    return frontseat
}

//funcion que busca si hay asiento libre ATRAS y lo devuelve.
async function search_back_seat(seattypeid, seat, seatsfree) {
    var seattype = await search_seat_type_id(seattypeid, seatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    const backseat = seattype.find(seat => seat.seat_column === seatcolumn &&
        seat.seat_row === seatrow + 1 ) 
             
    return backseat
}

//funcion que busca si hay asiento libre ADELANTE IZQUIERDA y lo devuelve.
async function search_front_seat_left(seattypeid, seat, seatsfree) {
    var seattype = await search_seat_type_id(seattypeid, seatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    const frontseatleft = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) - 1) &&
        seat.seat_row === seatrow -1 )      
    return frontseatleft
}


//funcion que busca si hay asiento libre ADELANTE DERECHA y lo devuelve.
async function search_front_seat_right(seattypeid, seat, seatsfree) {
    var seattype = await search_seat_type_id(seattypeid, seatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    const frontseatright = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) + 1) &&
        seat.seat_row === seatrow -1 )      
    return frontseatright
}

//funcion que busca si hay asiento libre ATRAS IZQUIERDA y lo devuelve.
async function search_back_seat_left(seattypeid, seat, seatsfree) {
    var seattype = await search_seat_type_id(seattypeid, seatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    const backseatleft = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) - 1) &&
        seat.seat_row === seatrow + 1 )      
    return backseatleft
}

//funcion que busca si hay asiento libre ATRAS DERECHA y lo devuelve.
async function search_back_seat_right(seattypeid, seat, seatsfree) {
    var seattype = await search_seat_type_id(seattypeid, seatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    const backseatright = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) + 1) &&
        seat.seat_row === seatrow + 1 )      
    return backseatright
}


async function search_seat_type_id(seattypeid, seatsfree) {
    var seattype = "";
    switch (seattypeid) {
        case 1:
            seattype = seatsfree.class1;
            break;
        case 2:
            seattype = seatsfree.class2;
            break;
        default:
            seattype = seatsfree.class3;
            break;
    }
    return seattype
}