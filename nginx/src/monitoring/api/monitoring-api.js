import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    chart: '/api/monitoring/chart'
};

function getAuthHeader() {
    return 'Bearer ' + localStorage.getItem('token');
}

function getEnergyConsumptionByUser(params, callback) {
    // URL: /monitoring/chart/user/{userId}?date={date}
    let requestUrl = HOST.backend_api + endpoint.chart + "/user/" + params.userId + "?date=" + params.date;
    let request = new Request(requestUrl, {
        method: 'GET',
        headers: { 'Authorization': getAuthHeader() }
    });
    RestApiClient.performRequest(request, callback);
}

export {
    getEnergyConsumptionByUser
};
