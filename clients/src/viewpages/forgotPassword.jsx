import React, { useState } from "react";
import Nav from 'react-bootstrap/Nav';

function ForgotPassword() {
    const [email, setEmailText] = useState("");
    const [phone, setPhoneText] = useState("");
    const [resetEmailSent, setResetEmailSentState] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    return ( <div>
        {!resetEmailSent &&
        <div style={{ marginLeft: '2%', marginTop: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '20px' }}><b>Forgot Password?</b></div>
            <div>
                <input type="text" value={email} placeholder="email"
                style={{ width: '80%', marginBottom: '20px' }} onChange={(e) => {
                    setEmailText(e.target.value);
                }}/>
            </div>
            <div>
                <input type="text" value={phone} placeholder="phone"
                style={{ width: '80%' }} onChange={(e) => {
                    setPhoneText(e.target.value);
                }}/>
            </div>
            <Nav.Link style={{ backgroundColor: '#2D3648', maxWidth: '150px', marginTop: '20px', height: '50px' }} onClick={(e) => {
                if (!email) setErrorMsg("Please provide your email.");
                else if (!phone) setErrorMsg("Please provide your phone.");
                else {
                    // do something
                    setResetEmailSentState(true);
                }
            }}>
                <div style={{ color: 'red', fontSize: '20px', textAlign: 'center', position: 'relative', top: '50%', transform: 'translate(0, -50%)' }}>Confirm</div>
            </Nav.Link>
            {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
        </div>}
        {resetEmailSent &&
        <div style={{ marginLeft: '2%', marginTop: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '20px' }}><b>Reset Email Sent</b></div>
            <div>
                <p>An email has been sent to your mailbox containing the link to reset your password. You will receive it shortly.</p>
                <p>Check your junk or trash folder if you cannot find it.</p>
            </div>
        </div>}
    </div> );
}

export default ForgotPassword;