class API {
    _headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

    _xhr = new XMLHttpRequest();

    /** @returns {Promise<{ ok: boolean } | Error>} */
    submitWhitePaper = async (fields) => new Promise((resolve, reject) => {
        console.log('fields', fields);
        this._xhr.open('post', 'https://api.hsforms.com/submissions/v3/integration/submit/7282193/9f4988d7-98e8-4e7c-afe4-7417981d62c9', false);
        this._xhr.setRequestHeader('Content-Type', 'application/json');

        this._xhr.send(this._createBody(fields));

        if (this._xhr.status !== 200) {
            reject(new Error(this._xhr.responseText));
        } else {
            resolve({ ok: true });
        }
    })

    _createBody(fields) {
        return JSON.stringify({
            headers: this._headers,
            legalConsentOptions: {
                consent: { // Include this object when GDPR options are enabled
                    consentToProcess: true,
                    text: 'I agree to allow Example Company to store and process my personal data.',
                    communications: [{
                        value: true,
                        subscriptionTypeId: 999,
                        text: 'I agree to receive marketing communications from Example Company.',
                    }],
                },
            },
            fields,
        });
    }

}

const Instance = new API();

export default Instance;
