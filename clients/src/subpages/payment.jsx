import PaymentCard from "./paymentCard";

function Payments({ user }) {
    // TODO show profile topbar and payment info
    return ( <div>
        <PaymentCard user={user} />
    </div> );
}

export default Payments;