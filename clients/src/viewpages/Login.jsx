// import React, { useEffect, useState } from "react";
// import Nav from 'react-bootstrap/Nav';
// import { Navigate, useNavigate } from "react-router-dom";
// import authentication from "../service/authentication";
// import { useAuth } from "../service/AuthenticationProvider";

// function Login() {
//     const { auth, login, register } = useAuth(); // Use the authentication context hook
//   const navigate = useNavigate();

//   const [email, setEmailText] = useState("");
//   const [pw, setPwText] = useState("");
//   const [loginErrorMsg, setLoginErrorMsg] = useState("");

//   const [registerEmail, setRegisterEmailText] = useState("");
//   const [registerName, setRegisterNameText] = useState("");
//   const [registerPhone, setRegisterPhoneText] = useState("");
//   const [registerPw, setRegisterPwText] = useState("");
//   const [registerErrorMsg, setRegisterErrorMsg] = useState("");

//   const handleLogin = async () => {
//     if (!email) {
//       setLoginErrorMsg("Please provide your email.");
//       return;
//     }
//     if (!pw) {
//       setLoginErrorMsg("Please provide your password.");
//       return;
//     }

//     try {
//       await login(email, pw);
//       navigate("/Profile");
//     } catch (error) {
//       setLoginErrorMsg(error.message);
//     }
//   };

//   const handleRegister = async () => {
//     if (!registerEmail || !registerName || !registerPhone || !registerPw) {
//       setRegisterErrorMsg("Please fill in all fields.");
//       return;
//     }

//     try {
//       await register(registerName, registerEmail, registerPhone, registerPw);
//       navigate("/Profile");
//     } catch (error) {
//       setRegisterErrorMsg(error.message);
//     }
//   };

//   // Check if the user is already authenticated
//   if (auth && auth.authenticated) {
//     navigate("/Profile", { replace: true });
//     return null;
//   }
//     else return (
//         <div style={{ width: '100%', marginLeft: '2%', marginTop: '20px', display: 'table' }}>
//             <div style={{ display: 'table-row' }}>
//                 <div style={{ width: "33%", display: 'table-cell' }}>
//                     <div style={{ fontSize: '32px', marginBottom: '20px' }}><b>Login</b></div>
//                     <div>
//                         <input type="text" value={email} placeholder="email"
//                         style={{ width: '80%', marginBottom: '20px' }} onChange={(e) => {
//                             setEmailText(e.target.value);
//                         }}/>
//                     </div>
//                     <div>
//                         <input type="text" value={pw} placeholder="password"
//                         style={{ width: '80%' }} onChange={(e) => {
//                             setPwText(e.target.value);
//                         }}/>
//                     </div>
//                     <Nav.Link href='/ForgotPassword' style={{ maxWidth: '130px', color: 'yellow' }}>Forgot password?</Nav.Link>
//                     <Nav.Link style={{ backgroundColor: '#2D3648', maxWidth: '120px', marginTop: '20px', height: '50px' }} onClick={async (e) => {
//                         if (!email) setLoginErrorMsg("Please provide your email.");
//                         else if (!pw) setLoginErrorMsg("Please provide your password.");
//                         else {
//                             setLoginErrorMsg("");
//                             const response = await authentication.tryLogin(email, pw);
//                             if (response.ok) navigate("/Profile");
//                             else setLoginErrorMsg((await response.json()).message);
//                         }
//                     }}>
//                         <div style={{ color: 'red', fontSize: '20px', textAlign: 'center', position: 'relative', top: '50%', transform: 'translate(0, -50%)' }}>Login</div>
//                     </Nav.Link>
//                     {loginErrorMsg && <div style={{ color: 'red' }}>{loginErrorMsg}</div>}
//                 </div>
//                 <div style={{ width: "67%", display: 'table-cell' }}>
//                     <div style={{ fontSize: '32px', marginBottom: '20px' }}><b>Register</b></div>
//                     <div style={{ width: '100%', marginBottom: '20px' }}>
//                         <input type="text" value={registerEmail} placeholder="email"
//                         style={{ width: '40%', marginRight: '20px' }} onChange={(e) => {
//                             setRegisterEmailText(e.target.value);
//                         }}/>
//                         <input type="text" value={registerName} placeholder="name"
//                         style={{ width: '40%' }} onChange={(e) => {
//                             setRegisterNameText(e.target.value);
//                         }}/>
//                     </div>
//                     <div style={{ width: '100%' }}>
//                         <input type="text" value={registerPhone} placeholder="phone"
//                         style={{ width: '40%', marginRight: '20px' }} onChange={(e) => {
//                             setRegisterPhoneText(e.target.value);
//                         }}/>
//                         <input type="text" value={registerPw} placeholder="password"
//                         style={{ width: '40%' }} onChange={(e) => {
//                             setRegisterPwText(e.target.value);
//                         }}/>
//                     </div>
//                     <Nav.Link style={{ backgroundColor: '#2D3648', maxWidth: '150px', marginTop: '40px', height: '50px' }} onClick={async (e) => {
//                         if (!registerEmail) setRegisterErrorMsg("Please provide your email.");
//                         else if (!registerName) setRegisterErrorMsg("Please provide your name.");
//                         else if (!registerPhone) setRegisterErrorMsg("Please provide your phone.");
//                         else if (!registerPw) setRegisterErrorMsg("Please provide your password.");
//                         else {
//                             setRegisterErrorMsg("");
//                             const response = await authentication.tryRegister(registerName, registerEmail, registerPhone, registerPw);
//                             if (response.ok) navigate("/Profile");
//                             else setRegisterErrorMsg((await response.json()).message);
//                         }
//                     }}>
//                         <div style={{ color: 'red', fontSize: '20px', textAlign: 'center', position: 'relative', top: '50%', transform: 'translate(0, -50%)' }}>Register</div>
//                     </Nav.Link>
//                     {registerErrorMsg && <div style={{ color: 'red' }}>{registerErrorMsg}</div>}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;



import React, { useEffect, useState } from "react";
import Nav from 'react-bootstrap/Nav';
import { Navigate, useNavigate } from "react-router-dom";
import authentication from "../service/authentication";

function Login() {
    // preps
    const navigate = useNavigate();

    // login
    const [email, setEmailText] = useState("");
    const [pw, setPwText] = useState("");
    const [loginErrorMsg, setLoginErrorMsg] = useState("");

    // register
    const [registerEmail, setRegisterEmailText] = useState("");
    const [registerName, setRegisterNameText] = useState("");
    const [registerPhone, setRegisterPhoneText] = useState("");
    const [registerPw, setRegisterPwText] = useState("");
    const [registerErrorMsg, setRegisterErrorMsg] = useState("");
    
    // auth
    const [authCheckInProgress, setAuthCheckInProgress] = useState(false);
    const [response, setResponse] = useState(null);

    // Function to save authentication status to local storage
    function saveAuthenticationToLocalStorage(authenticated) {
        localStorage.setItem("authenticated", authenticated ? "true" : "false");
    }

    async function checkAuth() {
        setAuthCheckInProgress(true);
        const response = await authentication.getAuth();
        setResponse(await response.json());
    }

    async function tryLogin(e) {
        if (!email) setLoginErrorMsg("Please provide your email.");
        else if (!pw) setLoginErrorMsg("Please provide your password.");
        else {
            setLoginErrorMsg("");
            const response = await authentication.tryLogin(email, pw);
            if (response.ok) navigate("/Profile");
            else setLoginErrorMsg((await response.json()).message);
        }
    }

    async function tryRegister(e) {
        if (!registerEmail) setRegisterErrorMsg("Please provide your email.");
        else if (!registerName) setRegisterErrorMsg("Please provide your name.");
        else if (!registerPhone) setRegisterErrorMsg("Please provide your phone.");
        else if (!registerPw) setRegisterErrorMsg("Please provide your password.");
        else {
            setRegisterErrorMsg("");
            const response = await authentication.tryRegister(registerName, registerEmail, registerPhone, registerPw);
            if (response.ok) navigate("/Profile");
            else setRegisterErrorMsg((await response.json()).message);
        }
    }

    if (!authCheckInProgress) checkAuth();

    if (!response) {
        return null;
    }
    
    if (response.authenticated) {
        saveAuthenticationToLocalStorage(true);
        return (<Navigate to="/Profile" replace={true} />);
    }
    else return (
        <div style={{ width: '100%', marginLeft: '2%', marginTop: '20px', display: 'table' }}>
            <div style={{ display: 'table-row' }}>
                <div style={{ width: "33%", display: 'table-cell' }}>
                    <div style={{ fontSize: '32px', marginBottom: '20px' }}><b>Login</b></div>
                    <div>
                        <input type="text" value={email} placeholder="email"
                        style={{ width: '80%', marginBottom: '20px' }} onChange={(e) => {
                            setEmailText(e.target.value);
                        }}/>
                    </div>
                    <div>
                        <input type="password" value={pw} placeholder="password"
                        style={{ width: '80%' }} onChange={(e) => {
                            setPwText(e.target.value);
                        }} onKeyDown={(e) => {
                            if (e.key === 'Enter') tryLogin(e);
                        }}/>
                    </div>
                    <Nav.Link href='/ForgotPassword' style={{ maxWidth: '130px', color: 'yellow' }}>Forgot password?</Nav.Link>
                    <Nav.Link style={{ backgroundColor: '#2D3648', maxWidth: '120px', marginTop: '20px', height: '50px' }} onClick={tryLogin}>
                        <div style={{ color: 'red', fontSize: '20px', textAlign: 'center', position: 'relative', top: '50%', transform: 'translate(0, -50%)' }}>Login</div>
                    </Nav.Link>
                    {loginErrorMsg && <div style={{ color: 'red' }}>{loginErrorMsg}</div>}
                </div>
                <div style={{ width: "67%", display: 'table-cell' }}>
                    <div style={{ fontSize: '32px', marginBottom: '20px' }}><b>Register</b></div>
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <input type="text" value={registerEmail} placeholder="email"
                        style={{ width: '40%', marginRight: '20px' }} onChange={(e) => {
                            setRegisterEmailText(e.target.value);
                        }}/>
                        <input type="text" value={registerName} placeholder="name"
                        style={{ width: '40%' }} onChange={(e) => {
                            setRegisterNameText(e.target.value);
                        }}/>
                    </div>
                    <div style={{ width: '100%' }}>
                        <input type="text" value={registerPhone} placeholder="phone"
                        style={{ width: '40%', marginRight: '20px' }} onChange={(e) => {
                            setRegisterPhoneText(e.target.value);
                        }}/>
                        <input type="password" value={registerPw} placeholder="password"
                        style={{ width: '40%' }} onChange={(e) => {
                            setRegisterPwText(e.target.value);
                        }} onKeyDown={(e) => {
                            if (e.key === 'Enter') tryRegister(e);
                        }}/>
                    </div>
                    <Nav.Link style={{ backgroundColor: '#2D3648', maxWidth: '150px', marginTop: '40px', height: '50px' }} onClick={tryRegister}>
                        <div style={{ color: 'red', fontSize: '20px', textAlign: 'center', position: 'relative', top: '50%', transform: 'translate(0, -50%)' }}>Register</div>
                    </Nav.Link>
                    {registerErrorMsg && <div style={{ color: 'red' }}>{registerErrorMsg}</div>}
                </div>
            </div>
        </div>
    );
}

export default Login;