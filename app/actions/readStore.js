 // @flow
import storage from 'electron-json-storage';
import _isEmpty from 'lodash.isempty';

export default function readStore(dataType, payload = {}) {
    return (dispatch) => {
        dispatch({
            type: 'READING_' + dataType.toUpperCase() + '_START',
            payload: payload
        });

        let sufix = payload.sufix || '';

        return new Promise((resolve, reject) => {
            storage.get(dataType + sufix, (error, data) => {
                if (error) {
                    dispatch({
                        type: 'READING_' + dataType.toUpperCase() + '_FAILED',
                        payload: error
                    });
                    reject('readingStorageFailed');
                    return;
                }

                let result = [];
                if (!_isEmpty(data)) {
                    try {
                       result = JSON.parse(data);
                    } catch(e) {
                        reject('parsingStorageDataFailed');
                        return;
                    }

                }

                dispatch({
                    type: 'READING_' + dataType.toUpperCase() + '_COMPLETE',
                    payload: result
                });

                resolve({
                    request: payload,
                    result: result
                });
            });
        });
    }
};
