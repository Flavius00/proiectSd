function performRequest(request, callback) {
    fetch(request)
        .then(
            function (response) {
                if (response.ok) {

                    if (request.url.includes("/register") && response.status === 201) {
                        response.text().then(text => {
                            callback(text, response.status, null);
                        }).catch(err => {
                            callback(null, response.status, err);
                        });
                    }
                    else if (response.status === 204 || (response.status === 201 && response.headers.get('Content-Length') === '0')) {
                        callback(true, response.status, null);
                    }
                    else {
                        response.json().then(json => {
                            callback(json, response.status, null);
                        }).catch(err => {
                            callback(null, response.status, err);
                        });
                    }

                }
                else {
                    response.json()
                        .then(err => callback(null, response.status, err))
                        .catch(() => {
                            callback(null, response.status, "Server error");
                        });
                }
            })
        .catch(function (err) {
            callback(null, 1, err)
        });
}

module.exports = {
    performRequest
};
