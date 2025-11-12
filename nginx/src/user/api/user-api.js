import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    user: '/api/users'
};

function getAuthHeader() {
    return 'Bearer ' + localStorage.getItem('token');
}

function getUsers(callback) {
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'GET',
        headers: {
            'Authorization': getAuthHeader()
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getUserById(params, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + "/" + params.id, {
        method: 'GET',
        headers: {
            'Authorization': getAuthHeader()
        }
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postUser(user, callback) {
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteUser(params, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + "/" + params.id, {
        method: 'DELETE',
        headers: {
            'Authorization': getAuthHeader()
        }
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function updateUser(params, user, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + "/" + params.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getUsers,
    getUserById,
    postUser,
    deleteUser,
    updateUser
};
