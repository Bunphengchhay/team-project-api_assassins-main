import server from "./server_fetcher";

class Authentication {
    headers = {
        "Content-Type": "application/json",
    }

    constructor() {
    }

    getAuth() {
        return server.fetch('auth', {
            method: "GET"
        });
    }

    tryLogin(email, password) {
        return server.fetch('login', {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
    }

    tryRegister(name, email, phone, password) {
        return server.fetch('register', {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                name: name,
                email: email,
                phone_number: phone,
                password: password
            })
        });
    }

    tryLogout() {
        return server.fetch('logout', {
            method: "POST"
        })
    }

    // Function to update premium membership status
    updatePremiumMembership(userId, isPremium) {
        return server.fetch('users/${userId}/membership', {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify({
                premium: isPremium,
            }),
        });
    }
    
}

const authentication = new Authentication();
export default authentication;
