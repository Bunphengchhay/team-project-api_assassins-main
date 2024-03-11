class ServerFetcher {
    #devApiUrl = "http://localhost:5002";
    #relApiUrl = "https://api-assassins-balancer-2018757611.us-east-1.elb.amazonaws.com"

    constructor() {
        this.env = process.env.NODE_ENV;
    }

    /**
     * 
     * @param {*} route 
     * @param {RequestInit | undefined} init 
     * @returns 
     */
    fetch(route, init) {
        const input = `${this.env == "production" ? this.#relApiUrl : this.#devApiUrl}/api/${route}`;
        return fetch(input, {
            ... init,
            credentials: 'include'
        });
    }
}

const server = new ServerFetcher();
export default server;