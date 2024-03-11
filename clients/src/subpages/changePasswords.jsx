import React, { useState } from "react";
import Nav from 'react-bootstrap/Nav';

function ChangePassWords({ user }) {
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [reenterPw, setReenterPw] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);

    async function tryChangePassword(e) {
        if (!currentPw) setErrorMsg("Please enter your current password.");
        else if (!newPw) setErrorMsg("Please enter your new password.");
        else if (currentPw === newPw) setErrorMsg("Please enter a different password.");
        else if (newPw !== reenterPw) setErrorMsg("Reentered password does not match your new password.");
        else {
            const result = await user.tryUpdatePassword(currentPw, newPw);
            if (result.success) {
                setErrorMsg("");
                setSuccess(true);
            } else setErrorMsg(result.message);
        }
        setCurrentPw("");
        setNewPw("");
        setReenterPw("");
        if (success) setSuccess(false);
    }

    return ( <div style={{ width: '100%', marginLeft: '2%', display: 'table' }}>
        <div style={{ display: 'table-row' }}>
            <div style={{ width: "33%", display: 'table-cell' }}>
                <div>
                    <input type="password" value={currentPw} placeholder="old password"
                    style={{ width: '80%', marginBottom: '20px' }} onChange={(e) => {
                        setCurrentPw(e.target.value);
                    }}/>
                </div>
            </div>
            <div style={{ width: "33%", display: 'table-cell' }}>
                <div style={{ width: '100%', marginBottom: '20px' }}>
                    <input type="password" value={newPw} placeholder="new password"
                    style={{ width: '80%', marginRight: '20px' }} onChange={(e) => {
                        setNewPw(e.target.value);
                    }}/>
                </div>
                <div>
                    <input type="password" value={reenterPw} placeholder="reenter password"
                    style={{ width: '80%' }} onChange={(e) => {
                        setReenterPw(e.target.value);
                    }} onKeyDown={(e) => {
                        if (e.key === 'Enter') tryChangePassword(e);
                    }}/>
                </div>
            </div>
            <Nav.Link style={{ backgroundColor: '#2D3648', maxWidth: '150px', marginTop: '40px', height: '50px', width: "34%" }} onClick={tryChangePassword}>
                <div style={{ color: 'red', fontSize: '20px', textAlign: 'center', position: 'relative', top: '50%', transform: 'translate(0, -50%)' }}>
                    Confirm
                </div>
            </Nav.Link>
            {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
            {success && <div style={{ color: 'green' }}>Password changed successfully.</div>}
        </div>
    </div> );
}

export default ChangePassWords;