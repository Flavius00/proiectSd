import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    chart: '/api/monitoring/chart'
};

function getAuthHeader() {
    return 'Bearer ' + localStorage.getItem('token');
}

function getEnergyConsumption(params, callback) {
    // Construim URL-ul folosind API Gateway (HOST.backend_api)
    // URL final: http://localhost/api/monitoring/reading/chart/{deviceId}?date={date}
    let requestUrl = HOST.backend_api + endpoint.chart + "/" + params.deviceId + "?date=" + params.date;

    let request = new Request(requestUrl, {
        method: 'GET',
        headers: {
            'Authorization': getAuthHeader(),
            'Accept': 'application/json'
        }
    });

    console.log("Monitoring API Call:", request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getEnergyConsumption
};
