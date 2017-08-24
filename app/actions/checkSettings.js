// @flow
export default function checkSettings(payload = {}) {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (payload.pointId && (payload.pointId > 1)
                && payload.serverUrl && (payload.serverUrl.length > 5)
                && payload.authToken && (payload.authToken.length > 5)
            ) {
                resolve(payload);
            }

            reject('invalidSettings');
        });
    }
};
