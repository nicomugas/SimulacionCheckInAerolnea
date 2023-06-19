
export const locate_passengers_with_minors = async (listpassengers, listseatsfree, airplaneid) => {
    let totalpassengers = listpassengers;
    for (const purchase of listpassengers) {
        const listfreeseatbyclass = await search_seat_type_id(Number(purchase[0].seatTypeId), listseatsfree)
        let firstseat = {}
        let nextseat = {}
        let asign = false

        for (let i = 0; i < listfreeseatbyclass.length; i++) {
            const seat = listfreeseatbyclass[i]
            firstseat = seat
            nextseat = await search_next_seat(Number(purchase[0].seatTypeId), seat, listseatsfree)
            if (nextseat !== null) {
                asign = true
                break;
            }
        }
        if (asign) {
            totalpassengers = await asign_seat_adult_and_child(purchase, firstseat, nextseat, listseatsfree)

            await seat_delete(firstseat.seat_id, listseatsfree, firstseat.seat_type_id)
            await seat_delete(nextseat.seat_id, listseatsfree, nextseat.seat_type_id)
            if (purchase.length > 2) {
                let lastseatassigned = nextseat
                for (let i = 0; i < purchase.length; i++) {
                    if (purchase[i].seatId === null) {
                        const nearbyplace = await search_nearby_seat(purchase[i].seatTypeId, lastseatassigned, listseatsfree)
                        totalpassengers = await asign_seat_adult(purchase, purchase[i].passengerId, nearbyplace)
                        await seat_delete(nearbyplace.seat_id, listseatsfree, nearbyplace.seat_type_id)
                        lastseatassigned = nearbyplace
                    }
                }
            }
        } else {
            //TODO: find in UP category. 
        }
    }
    return totalpassengers
}



export const locate_passengers_groups = async (purchasewithoutminor, listseatsfree, airplaneid) => {
    let totalpassengerswithoutminors = purchasewithoutminor;
    for (const purchase of totalpassengerswithoutminors) {
        let nearbyplace
        let lastseatassigned
        let first = false
        for (let j = 0; j < purchase.length; j++) {
            if (purchase[j].seatId === null) {
                if (first === false) {
                    nearbyplace = await search_first_free_any_seat(purchase[j].seatTypeId, listseatsfree, airplaneid)
                    totalpassengerswithoutminors = await asign_seat_adult(purchase, purchase[j].passengerId, nearbyplace)
                    await seat_delete(nearbyplace.seat_id, listseatsfree, nearbyplace.seat_type_id)
                    lastseatassigned = nearbyplace
                    first = true
                } else {
                    nearbyplace = await search_nearby_seat(purchase[j].seatTypeId, lastseatassigned, listseatsfree)
                    totalpassengerswithoutminors = await asign_seat_adult(purchase, purchase[j].passengerId, nearbyplace)
                    await seat_delete(nearbyplace.seat_id, listseatsfree, nearbyplace.seat_type_id)
                    lastseatassigned = nearbyplace
                }
            }
        }

        //TODO: find in UP category.       
    }
    return totalpassengerswithoutminors
}

export const seat_unique_passengers = async (uniquepassengers, listseatsfree, airplaneid) => {
    let totalpassengersunique = uniquepassengers;
    for (const purchase of totalpassengersunique) {
        let nearbyplace
        for (let j = 0; j < purchase.length; j++) {
            if (purchase[j].seatId === null) {
                nearbyplace = await search_first_free_any_seat(purchase[j].seatTypeId, listseatsfree, airplaneid)
                totalpassengersunique = await asign_seat_adult(purchase, purchase[j].passengerId, nearbyplace)
                await seat_delete(nearbyplace.seat_id, listseatsfree, nearbyplace.seat_type_id)
            }
        }
    }
    //TODO: find in UP category.  
    return totalpassengersunique
}



async function search_first_free_any_seat(seattypeid, listseatsfree, airplaneid) {
    var seattype = await search_seat_type_id(seattypeid, listseatsfree)
    const firstfreeseat = seattype.find(seat => seat.airplane_id === airplaneid && seat.seat_type_id === seattypeid)
    return firstfreeseat;
}

async function search_first_free_seat(seattypeid, seat, listseatsfree) {
    var seattype = await search_seat_type_id(seattypeid, listseatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    let frontseat;
    frontseat = seattype.find(seat => seat.seat_column === seatcolumn)
    if (typeof frontseat === 'undefined') {
        frontseat = seattype.find(seat => seat.seat_row === seatrow)
        if (typeof frontseat === 'undefined') {
            seattype.find(seat => seat.seat_type_id === seattypeid)
        }
    }
    return frontseat
}

async function seat_delete(seatid, listofseat, seattypeid) {
    var deleteindex = null;
    switch (seattypeid) {
        case 1:
            deleteindex = listofseat.class1.findIndex(seat => seat.seat_id === seatid);
            listofseat.class1.splice(deleteindex, 1);
            break;
        case 2:
            deleteindex = listofseat.class2.findIndex(seat => seat.seat_id === seatid);
            listofseat.class2.splice(deleteindex, 1);
            break;
        default:
            deleteindex = listofseat.class3.findIndex(seat => seat.seat_id === seatid);
            listofseat.class3.splice(Number(deleteindex), 1);
            break;
    }
    return
}

async function asign_seat_adult_and_child(purchase, firstseat, nextseat, listseatsfree) {

    const minorindex = purchase.findIndex(p => p.age < 18)
    const adultindex = purchase.findIndex(p => p.age >= 18)
    purchase[adultindex].seatId = firstseat.seat_id;
    purchase[minorindex].seatId = nextseat.seat_id
    return purchase
}

async function asign_seat_adult(purchase, passengerid, nearbyplace) {
    const index1 = purchase.findIndex(p => p.passengerId === passengerid)
    purchase[index1].seatId = nearbyplace.seat_id;
    return purchase
}

async function search_nearby_seat(seattypeid, seat, listseatsfree) {

    let foundseat
    foundseat = await search_next_seat(Number(seattypeid), seat, listseatsfree)
    if (typeof foundseat === 'undefined' || foundseat === null) {
        foundseat = await search_front_seat(seattypeid, seat, listseatsfree)
    }
    if (typeof foundseat === 'undefined' || foundseat === null) {
        foundseat = await search_back_seat(seattypeid, seat, listseatsfree)
    }
    if (typeof foundseat === 'undefined' || foundseat === null) {
        foundseat = await search_front_seat_left(seattypeid, seat, listseatsfree)
    }
    if (typeof foundseat === 'undefined' || foundseat === null) {
        foundseat = await search_front_seat_right(seattypeid, seat, listseatsfree)
    }
    if (typeof foundseat === 'undefined' || foundseat === null) {
        foundseat = await search_back_seat_left(seattypeid, seat, listseatsfree)
    }
    if (typeof foundseat === 'undefined' || foundseat === null) {
        foundseat = await search_back_seat_right(seattypeid, seat, listseatsfree)
    }
    if (typeof foundseat === 'undefined' || foundseat === null) {
        foundseat = await search_first_free_seat(seattypeid, seat, listseatsfree)
    }
    return foundseat;
}


async function search_next_seat(seattypeid, seat, listseatsfree) {
    var seattype = await search_seat_type_id(seattypeid, listseatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    let nextseat;
    nextseat = seattype.find(s => s.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) - 1) && s.seat_row === seatrow)

    if (typeof nextseat === 'undefined') {
        nextseat = seattype.find(s => s.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) + 1) && s.seat_row === seatrow)
        if (typeof nextseat === 'undefined') { return null }
    }
    return nextseat
}

async function search_front_seat(seattypeid, seat, listseatsfree) {
    var seattype = await search_seat_type_id(seattypeid, listseatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    let frontseat;
    frontseat = seattype.find(seat => seat.seat_column === seatcolumn &&
        seat.seat_row === seatrow - 1)
    if (typeof frontseat === 'undefined') { return null }
    return frontseat
}


async function search_back_seat(seattypeid, seat, listseatsfree) {
    var seattype = await search_seat_type_id(seattypeid, listseatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    let backseat;
    backseat = seattype.find(seat => seat.seat_column === seatcolumn &&
        seat.seat_row === seatrow + 1)
    if (typeof backseat === 'undefined') { return null }
    return backseat
}

async function search_front_seat_left(seattypeid, seat, listseatsfree) {
    var seattype = await search_seat_type_id(seattypeid, listseatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    let frontseatleft;
    frontseatleft = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) - 1) &&
        seat.seat_row === seatrow - 1)
    if (typeof frontseatleft === 'undefined') { return null }
    return frontseatleft
}

async function search_front_seat_right(seattypeid, seat, listseatsfree) {
    var seattype = await search_seat_type_id(seattypeid, listseatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    let frontseatright;
    frontseatright = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) + 1) &&
        seat.seat_row === seatrow - 1)
    if (typeof frontseatright === 'undefined') { return null }
    return frontseatright
}

async function search_back_seat_left(seattypeid, seat, listseatsfree) {
    var seattype = await search_seat_type_id(seattypeid, listseatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    let backseatleft
    backseatleft = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) - 1) &&
        seat.seat_row === seatrow + 1)
    if (typeof backseatleft === 'undefined') { return null }
    return backseatleft
}

async function search_back_seat_right(seattypeid, seat, listseatsfree) {
    var seattype = await search_seat_type_id(seattypeid, listseatsfree)
    const seatcolumn = seat.seat_column;
    const seatrow = seat.seat_row;
    let backseatright
    backseatright = seattype.find(seat => seat.seat_column === String.fromCharCode(seatcolumn.charCodeAt(0) + 1) &&
        seat.seat_row === seatrow + 1)
    if (typeof backseatright === 'undefined') { return null }
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



