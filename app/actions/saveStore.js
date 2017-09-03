// @flow
import storage from 'electron-json-storage';

export default function saveStore(dataType, payload = {}) {
    return (dispatch) => {
        dispatch({
            type: 'STORING_' + dataType.toUpperCase() + '_START',
            payload: payload
        });

        return new Promise((resolve, reject) => {
            storage.set(dataType, JSON.stringify(payload), (error) => {
                dispatch({
                    type: 'STORING_' + dataType.toUpperCase() + '_FAILED',
                    payload: payload
                });
                reject('storingFailed');
            });

            dispatch({
                type: 'STORING_' + dataType.toUpperCase() + '_COMPLETE',
                payload: payload
            });
            resolve();
        });
    }
};
