import { useState, useEffect } from "react";
import { Nav } from "react-bootstrap"
import { Booking } from "../service/booking";
/** @type {React.CSSProperties} */
const ticketStyle = {
    width: "80%",
    minWidth: "600px",
    minHeight: "300px",
    marginLeft: "10%",
    marginTop: "40px",
    color: "black",
    borderRadius: "10px",
    backgroundColor: "#f2f2f2"
};
/** @type {React.CSSProperties} */
const cellStyle = { display: "table-cell", verticalAlign: "middle", width: "30%" };
/** @type {React.CSSProperties} */
const entryStyle = { marginLeft: "40px", marginTop: "10px" };
/** @type {React.CSSProperties} */
const buttonStyle = { marginLeft: "40px", marginTop: "10px", padding: "10px 10px 10px 10px", backgroundColor: "maroon", borderRadius: "20px", color: "white", display: 'table-cell' };
/** @type {React.CSSProperties} */
const tableStyle = { display: "table", marginTop: "20px", marginLeft: '30px', borderSpacing: '10px 0px' }
const moneyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'});

function HistoryEntryCard({ booking }) {
    const [cancelWarn, setCancelWarnState] = useState(false);
    const [refunded, setRefunded] = useState(false);
    const myBooking = new Booking();

    useEffect(()=>{
        console.log('test')
        console.log(myBooking.getAllUserBookingById('655ea97fab286d0eb25d3b5e'))
    },[])

    // const getAllOfMyBooking = () =>{
    //     return myBooking.getUserBookings().then((data) => {
    //         console.log(data)
    //     })
    // }
    const cancellationItems = function() {
        return (<div>
            {refunded && <div style={{...ticketStyle, textAlign: 'center', paddingTop: '75px', fontSize: '100px'}}><b>REFUNDED</b></div>}
            {cancelWarn && <div style={{ border: "1px solid black", marginLeft: "69%", width: "150px", height: '100px', backgroundColor: "white", color: "black" }}>
                <div style={{ marginBottom: '10px', marginTop: '10px', textAlign: "center" }}>Are you sure?</div>
                <Nav.Link style={{...buttonStyle, display: 'flex', marginRight: '30px' }} onClick={(e) => setRefunded(true)}>Confirm</Nav.Link>
            </div>}
        </div>);
    }

    booking.purchaseDateTime = new Date(booking.purchaseDateTime);

    if (booking.moviePass) {
        var screening = booking.moviePass.movieScreening;
        screening.dateTime = new Date(screening.dateTime);
        const theater = screening.theater;
        const movie = screening.movie;
        const tickets = booking.moviePass.tickets;
        const seats = tickets.map((ticket) => ticket.assignedSeat);

        const ticketPrice = tickets.reduce((prev, ticket) => prev + ticket.price, 0);
        const tax = tickets.reduce((prev, ticket) => prev + ticket.tax, 0);
        const discount = booking.discount;
        const fee = 0.89; // should we have them?

        return (<div onClick={(e) => {
            if (cancelWarn) setCancelWarnState(false);
        }}>
            {!refunded && <div style={ticketStyle}>
                <div style={{ display: "table" }}>
                    <img src={movie.poster} style={{ display: "table-cell", maxHeight: "300px", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }} />
                    <div style={cellStyle}>
                        <div style={{ fontSize: "24px", border: "1px solid black", marginLeft: "40px" }}>
                            {theater.name}: {theater.address.city} {theater.address.state} {theater.address.zipcode}
                        </div>
                        <div style={entryStyle}>Reservation ID: {booking._id.$oid}</div>
                        <div style={entryStyle}>Date: {screening.dateTime.toLocaleDateString()}</div>
                        <div style={entryStyle}>Time: {screening.dateTime.toLocaleTimeString()}</div>
                        <div style={entryStyle}>Seats: {seats.join(", ")}</div>
                        <div style={entryStyle}>Reserved on: {booking.purchaseDateTime.toLocaleString()}</div>
                    </div>
                    <div style={cellStyle}>
                        <div style={{ fontSize: "64px", textAlign: "center" }}>{movie.title}</div>
                    </div>
                    <div style={cellStyle}>
                        <div style={entryStyle}>Number of tickets: {tickets.length}</div>
                        <div style={entryStyle}>Ticket cost: {moneyFormat.format(ticketPrice)}</div>
                        <div style={entryStyle}>Tax: {moneyFormat.format(tax)}</div>
                        <div style={entryStyle}>Fee: {moneyFormat.format(fee)}</div>
                        <div style={entryStyle}>Discount: {moneyFormat.format(discount)}</div>
                        <div style={entryStyle}>Total cost: {moneyFormat.format(ticketPrice + tax + fee - discount)}</div>
                        {Date.now() < screening.dateTime &&
                        <div style={tableStyle}>
                            <Nav.Link style={buttonStyle} to='/Booking'>Modify</Nav.Link>
                            <Nav.Link style={buttonStyle} onClick={(e) => setCancelWarnState(true)}>Cancel</Nav.Link>
                        </div>}
                    </div>
                </div>
            </div>}
            {cancellationItems()}
        </div>);
    } else if (booking.snackPass) {
        booking.snackPass.expiry = new Date(booking.snackPass.expiry);
        const snacks = booking.snackPass.snacks;
        const totalItems = snacks.reduce((prev, snack) => prev + snack.count, 0);
        const itemPrice = snacks.reduce((prev, snack) => prev + snack.price * snack.count, 0);
        const tax = snacks.reduce((prev, snack) => prev + snack.tax * snack.count, 0);
        const discount = booking.discount;
        const fee = 0.89; // should we have them?

        return (<div onClick={(e) => {
            if (cancelWarn) setCancelWarnState(false);
        }}>{!refunded && <div style={ticketStyle}>
                <div style={{ display: "table", paddingTop: '20px' }}>
                    <div style={cellStyle}>
                        <div style={entryStyle}>Snack Redemption Order: {booking._id.$oid}</div>
                        <div style={{...entryStyle, marginTop: '150px' }}>Reserved on: {booking.purchaseDateTime.toLocaleString()}</div>
                        <div style={entryStyle}>Expires on: {booking.snackPass.expiry.toLocaleString()}</div>
                    </div>
                    <div style={{...cellStyle, verticalAlign: 'top'}}>
                        {snacks.map((snack) => (<div style={entryStyle}>
                            {snack.item}: {snack.count}
                        </div>))}
                    </div>
                    <div style={{...cellStyle, verticalAlign: 'top'}}>
                        <div style={entryStyle}>Number of items: {totalItems}</div>
                        <div style={entryStyle}>Snack cost: {moneyFormat.format(itemPrice)}</div>
                        <div style={entryStyle}>Tax: {moneyFormat.format(tax)}</div>
                        <div style={entryStyle}>Fee: {moneyFormat.format(fee)}</div>
                        <div style={entryStyle}>Discount: {moneyFormat.format(discount)}</div>
                        <div style={entryStyle}>Total cost: {moneyFormat.format(itemPrice + tax + fee - discount)}</div>
                        {!booking.snackPass.redeemed && Date.now() < booking.snackPass.expiry &&
                        <div style={tableStyle}>
                            <Nav.Link style={buttonStyle} to='/FoodAndDrink'>Modify</Nav.Link>
                            <Nav.Link style={buttonStyle} onClick={(e) => setCancelWarnState(true)}>Cancel</Nav.Link>
                        </div>}
                    </div>
                </div>
            </div>}
            {cancellationItems()}
        </div>);
    }
}

export default HistoryEntryCard;