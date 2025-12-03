import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    user: '/api/devices'
};

function getAuthHeader() {
    return 'Bearer ' + localStorage.getItem('token');
}
function getDevices(callback) {
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'GET',
        headers: {
            'Authorization': getAuthHeader()
        }
    });

    console.log(request.url);

    RestApiClient.performRequest(request, callback);
}

function getDeviceById(params, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + "/" + params.id, {
        method: 'GET',
        headers: {
            'Authorization': getAuthHeader()
        }
    });

    console.log(request.url);

    RestApiClient.performRequest(request, callback);
}

function postDevice(device, callback) {
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'POST',
        headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(device)
    });

    console.log(request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteDevice(params, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + "/" + params.id, {
        method: 'DELETE',
        headers: {
            'Authorization': getAuthHeader()
        }
    });

    console.log(request.url);

    RestApiClient.performRequest(request, callback);
}

function updateDevice(params, device, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + "/" + params.id, {
        method: 'PUT',
        headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(device)
    });

    console.log(request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getDevices,
    getDeviceById,
    postDevice,
    deleteDevice,
    updateDevice
};
