import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    auth: '/api/auth'
};

// Functie helper pentru a lua token-ul mereu proaspat
function getAuthHeader() {
    return "Bearer " + localStorage.getItem("token");
}

function login(credentials, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + "/login", {
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

function register(userFullDetails, callback) {
    // Aici userFullDetails contine acum si datele de profil (age, address etc)
    // Auth Service le va prelua si le va trimite prin RabbitMQ
    let request = new Request(HOST.backend_api + endpoint.auth + "/register", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userFullDetails)
    });

    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteUser(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + "/" + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            "Authorization": getAuthHeader(), 
        }
    });

    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function updateUser(id, user, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + "/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": getAuthHeader(),
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function getAuthById(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + "/" + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            "Authorization": getAuthHeader(),
        }
    });

    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    login,
    register,
    deleteUser as deleteAuth,
    updateUser as updateAuth,
    getAuthById
};
