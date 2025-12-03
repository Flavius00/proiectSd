import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    auth: '/api/auth'
};

const AUTH_TOKEN = "Bearer " + localStorage.getItem("token");

function login(credentials, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + "/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });

    RestApiClient.performRequest(request, callback);

    console.log("URL: " + request.url);
}

function register(credentials, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + "/register", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteUser(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + "/" + id, {
        method: 'DELETE',
        headers: {
            "Authorization": AUTH_TOKEN,
        }
    });

    RestApiClient.performRequest(request, callback);

    console.log("URL: " + request.url);
}

function updateUser(id, user, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + "/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": AUTH_TOKEN,
        },
        body: JSON.stringify(user)
    });

    RestApiClient.performRequest(request, callback);

    console.log("URL: " + request.url);
}

function getAuthById(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + "/" + id, {
        method: 'GET',
        headers: {
            "Authorization": AUTH_TOKEN,
        }
    });

    RestApiClient.performRequest(request, callback);

    console.log("URL: " + request.url);
}

export {
    login,
    register,
    deleteUser as deleteAuth,
    updateUser as updateAuth,
    getAuthById
};
