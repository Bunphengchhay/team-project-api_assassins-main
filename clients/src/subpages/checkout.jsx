import CheckoutForm from "./checkoutform";
import { useState } from "react";
function Checkout({bookingData}) {
    const reservationData = useState(bookingData)
    const reservationId = useState(bookingData?.reservationId);
    const finalReservation = useState(bookingData.finalServation)
    return ( 
        <div style={{width: '100vw', minHeight: '500px', backgroundColor: '#f2f2f2', borderRadius: '10px'}}>
            {/* <h1>Checkout</h1> */}
            <CheckoutForm reservationId = {reservationId}/>
        </div>
     );
}

export default Checkout;