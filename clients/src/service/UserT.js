import authentication from "./authentication";
import server from "./server_fetcher";

// Got error with User.js. need to rename with T as of now.
export class User {
    static #headers = {
        "Content-Type": "application/json",
    }

    constructor(info) {
        this._id = info._id;
        this.name = info.name;
        this.email = info.email;
        this.phone_number = info.phone_number;
        this.member = info.member;
        if (this.member.payment_info) this.member.payment_info.expiry = new Date(this.member.payment_info.expiry);
        this.roles = info.roles;
        this.bookings = info.bookings;
    }

    async tryUpdatePassword(oldPass, newPass) {
        const auth = await authentication.getAuth().then(x => x.json());
        if (auth.authenticated) {
            const result = await server.fetch(`users/${auth.user._id}/pass`, {
                method: "PUT",
                headers: User.#headers,
                body: JSON.stringify({
                    oldPass: oldPass,
                    newPass: newPass
                })
            }).then(x => x.json());
            return result;
        } else return {
            success: false,
            message: "Not authenticated. Please log in."
        };
    }

    async tryChangeMembership(state) {
        const auth = await authentication.getAuth().then(x => x.json());
        if (auth.authenticated) {
            const result = await server.fetch(`users/${auth.user._id}/membership`, {
                method: "PUT",
                headers: User.#headers,
                body: JSON.stringify({
                    membership: state
                })
            }).then(x => x.json());
            if (result.success) this.member.is_premium = state;
            return result;
        } else return {
            success: false,
            message: "Not authenticated. Please log in."
        };
    }

    async tryChangePaymentInfo(payment_info) {
        const auth = await authentication.getAuth().then(x => x.json());
        if (auth.authenticated) {
            const result = await server.fetch(`users/${auth.user._id}/payment`, {
                method: "PUT",
                headers: User.#headers,
                body: JSON.stringify(payment_info)
            }).then(x => x.json());
            if (result.success) this.payment_info = payment_info
            return result;
        } else return {
            success: false,
            message: "Not authenticated. Please log in."
        }
    }

    async tryDeletePaymentInfo() {
        const auth = await authentication.getAuth().then(x => x.json());
        if (auth.authenticated) {
            const result = await server.fetch(`users/${auth.user._id}/payment`, {
                method: "DELETE"
            }).then(x => x.json());
            if (result.success) this.payment_info = null
            return result;
        } else return {
            success: false,
            message: "Not authenticated. Please log in."
        }
    }

    static async getCurrentUser() {
        const auth = await authentication.getAuth().then(x => x.json());
        if (auth.authenticated) {
            const user = await server.fetch(`users/${auth.user._id}`, {
                method: "GET"
            }).then(x => x.json());
            return new User(user);
        } else return null;
    }

    static async getAccessibleUserList() {
        const users = await server.fetch('users', {
            method: "GET"
        }).then(x => x.json());
        return users.map(x => new User(x));
    }
}