import { useState } from "react";
import authentication from "../service/authentication";

function Logout() {
    const [logoutInProgress, setLogoutInProgress] = useState(false);
    const [loggedOut, setLoggedOut] = useState(false);

      // Function to save authentication status to local storage
      function saveAuthenticationToLocalStorage(authenticated) {
        localStorage.setItem("authenticated", authenticated ? "true" : "false");
    }
    async function logout() {
        setLogoutInProgress(true);
        await authentication.tryLogout();
        saveAuthenticationToLocalStorage(false)
        setLoggedOut(true);
    }
    if (!logoutInProgress) logout();

    if (!loggedOut) return null;
    else return ( <div>
        <div style={{ marginLeft: '2%', marginTop: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '20px' }}>You have logged out.</div>
            <div>
                <p>Thank you for using MovieAssassins. We hope you will visit again!</p>
                <p>For security reasons, please close your browser after logging out.</p>
            </div>
        </div>
    </div> );
}

export default Logout;