import { useState } from "react";
import { Nav } from "react-bootstrap"

/** @type {React.CSSProperties} */
const cardStyle = { width: "400px", height: "250px", border: '1px detailed black', marginLeft: '40%', borderRadius: '25px' }
/** @type {React.CSSProperties} */
const chipStyle = { width: "20%", height: "20%", left: '5%', top: '20%', borderRadius: '15px', backgroundColor: '#ffb800', position: 'relative' };
/** @type {React.CSSProperties} */
const confirmButtonStyle = {...chipStyle, width: '100%', height: '100%', padding: '10px 20px 10px 20px'};
/** @type {React.CSSProperties} */
const cancelButtonStyle = {borderRadius: '15px', backgroundColor: 'black', position: 'relative', padding: '5px 10px 5px 10px' };
const issuer = (<div style={chipStyle} />)
const cardStripe = (<div style={{width: '100%', height: '20%', top: '10%', backgroundColor: '#d9d9d9', position: 'relative'}} />);

function PaymentCard({ user }) {
    const [editing, setEditing] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(false);

    const [accountHolder, setAccountHolder] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [error, setError] = useState('');

    if (user.member.payment_info) {
        return (<div style={{ marginTop: '40px' }} onClick={(e) => {
            if (deleteWarning) setDeleteWarning(false);
        }}>
            {error && <div style={{ color: 'orange' }}>{error}</div>}
            <div style={{...cardStyle, backgroundColor: '#c30000'}}>
                {cardStripe}
                {!editing && <div style={{ position: 'relative', top: '15%', left: '5%', paddingBottom: '4.5%' }}>
                    <div>{user.member.payment_info.account_holder}</div>
                    <div>{user.member.payment_info.account}</div>
                    <div>Expiration: {user.member.payment_info.expiry.getMonth()}/{user.member.payment_info.expiry.getFullYear()}</div>
                    <Nav.Link style={{ position: 'absolute', top: '20%', left: '70%' }} onClick={(e) => {
                        setAccountHolder(user.member.payment_info.account_holder);
                        setAccountNumber(user.member.payment_info.account);
                        setExpiryMonth(user.member.payment_info.expiry.getMonth());
                        setExpiryYear(user.member.payment_info.expiry.getFullYear());
                        setSecurityCode('');
                        setEditing(true);
                    }}>
                        <div style={confirmButtonStyle}>Edit</div>
                    </Nav.Link>
                    <Nav.Link style={{ position: 'absolute', top: '125%', left: '70%' }}>
                        <div style={cancelButtonStyle} onClick={(e) => setDeleteWarning(true)}>Remove</div>
                    </Nav.Link>
                </div>}
                {editing && <div style={{ position: 'relative', top: '15%', left: '5%' }}>
                    <div style={{ width: '50% '}}>
                        <input type='text' value={accountHolder} placeholder="account holder" onChange={(e) => setAccountHolder(e.target.value)} />
                        <input type='text' value={accountNumber} placeholder="account number" onChange={(e) => setAccountNumber(e.target.value)} />
                        <input type='text' value={expiryMonth} placeholder="month" style={{ width: '30%' }}
                            onChange={(e) => setExpiryMonth(e.target.value)} />/
                        <input type='text' value={expiryYear} placeholder="year" style={{ width: '30%' }}
                            onChange={(e) => setExpiryYear(e.target.value)} />
                    </div>
                    <input type='password' value={securityCode} style={{ position: 'absolute', top: '125%', left: '25%', width: '15%'}}
                        placeholder="CVV" onChange={(e) => setSecurityCode(e.target.value)}></input>
                    <Nav.Link style={{ position: 'absolute', top: '20%', left: '65%' }} onClick={async (e) => {
                        // backend stuff
                        var date = new Date(parseInt(expiryYear), parseInt(expiryMonth) + 1);
                        date.setDate(date.getDate() - 1);
                        const payment_info = {
                            account_holder: accountHolder,
                            account: accountNumber,
                            expiry: date,
                            security_code: securityCode
                        };
                        const result = await user.tryChangePaymentInfo(payment_info);
                        // check for errors
                        if (result.success) {
                            setEditing(false);
                            setError('');
                            window.location.reload();
                        } else setError(result.message);
                    }}>
                        <div style={confirmButtonStyle}>Confirm</div>
                    </Nav.Link>
                    <Nav.Link style={{ position: 'absolute', top: '125%', left: '70%' }} onClick={(e) => setEditing(false)}>
                        <div style={cancelButtonStyle}>Cancel</div>
                    </Nav.Link>
                </div>}
                {issuer}
            </div>
            {deleteWarning && <div style={{ border: "1px solid black", marginLeft: "55%", width: "150px", height: '100px', backgroundColor: "white", color: "black" }}>
                <div style={{ marginBottom: '10px', marginTop: '10px', textAlign: "center" }}>Are you sure?</div>
                <Nav.Link style={{ marginLeft: "30px", marginTop: "10px", marginRight: '30px', padding: "10px 10px 10px 10px", backgroundColor: "maroon",
                    borderRadius: "20px", color: "white", display: 'flex' }} onClick={async (e) => {
                    const result = await user.tryDeletePaymentInfo();
                    if (!result.success) setError(result.message);
                    else {
                        setError('');
                        window.location.reload();
                    }
                }}>Confirm</Nav.Link>
            </div>}
        </div>);
    }
    else return (<div style={{ marginTop: '40px' }}>
        {error && <div style={{ color: 'orange' }}>{error}</div>}
        {!editing && <Nav.Link style={{...cardStyle, backgroundColor: '#818181'}} onClick={(e) => {
            setAccountHolder('');
            setAccountNumber('');
            setExpiryMonth('');
            setExpiryYear('');
            setSecurityCode('');
            setEditing(true);
        }}>
            {cardStripe}
            <div style={{ backgroundColor: '#d9d9d9', width: '48%', height: '10%', left: '25%', top: '40%', position: 'relative' }} />
            <div style={{ backgroundColor: '#d9d9d9', width: '8%', height: '60%', left: '45%', top: '5%', position: 'relative' }} />
        </Nav.Link>}
        {editing && <div style={{...cardStyle, backgroundColor: '#c30000'}}>
            {cardStripe}
            <div style={{ position: 'relative', top: '15%', left: '5%' }}>
                <div style={{ width: '50% '}}>
                    <input type='text' value={accountHolder} placeholder="account holder" onChange={(e) => setAccountHolder(e.target.value)} />
                    <input type='text' value={accountNumber} placeholder="account number" onChange={(e) => setAccountNumber(e.target.value)} />
                    <input type='text' value={expiryMonth} placeholder="month" style={{ width: '30%' }}
                        onChange={(e) => setExpiryMonth(e.target.value)} />/
                    <input type='text' value={expiryYear} placeholder="year" style={{ width: '30%' }}
                        onChange={(e) => setExpiryYear(e.target.value)} />
                </div>
                <input type='password' value={securityCode} style={{ position: 'absolute', top: '125%', left: '25%', width: '15%'}}
                    placeholder="CVV" onChange={(e) => setSecurityCode(e.target.value)}></input>
                <Nav.Link style={{ position: 'absolute', top: '20%', left: '65%' }} onClick={async (e) => {
                    // backend stuff
                    var date = new Date(parseInt(expiryYear), parseInt(expiryMonth) + 1);
                    date.setDate(date.getDate() - 1);
                    const payment_info = {
                        account_holder: accountHolder,
                        account: accountNumber,
                        expiry: date,
                        security_code: securityCode
                    };
                    console.log(payment_info)
                    const result = await user.tryChangePaymentInfo(payment_info);
                    // check for errors
                    if (result.success) {
                        setEditing(false);
                        setError('');
                        window.location.reload();
                    } else setError(result.message);
                }}>
                    <div style={confirmButtonStyle}>Confirm</div>
                </Nav.Link>
                <Nav.Link style={{ position: 'absolute', top: '125%', left: '70%' }} onClick={(e) => setEditing(false)}>
                    <div style={cancelButtonStyle}>Cancel</div>
                </Nav.Link>
            </div>
            {issuer}
        </div>}
    </div>)
}

export default PaymentCard;