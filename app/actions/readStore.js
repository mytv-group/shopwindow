 // @flow
import { bindActionCreators } from 'redux';
import storage from 'electron-json-storage';
import fs from 'fs';
import path from 'path';
import _isEmpty from 'lodash.isempty';
import isJSON from 'is-json';

import saveStore from 'actions/saveStore'

const SETTINGS_FILE = 'settings.conf';

function readStoreSuccess(
    dispatch,
    resolve,
    dataType,
    payload,
    result
) {
    dispatch({
        type: 'READING_' + dataType.toUpperCase() + '_COMPLETE',
        payload: result
    });

    resolve({
        request: payload,
        result: result
    });
}

export default function readStore(dataType, payload = {}) {
    return (dispatch) => {
        dispatch({
            type: 'READING_' + dataType.toUpperCase() + '_START',
            payload: payload
        });

        let sufix = payload.sufix || '';

        return new Promise((resolve, reject) => {
            storage.get(dataType + sufix, (error, data) => {
                if (!error && _isEmpty(data)) {
                    let confFile = path.join(__dirname, SETTINGS_FILE);
                    if (fs.existsSync(confFile)) {
                        fs.readFile(confFile, 'utf8', (err, data) => {
                            if (!err && isJSON(data)) {
                                let bindedSaveStore = bindActionCreators(saveStore, dispatch);
                                let settings  = JSON.parse(data);
                                bindedSaveStore('settings', settings)
                                    .then(() => {
                                        readStoreSuccess(
                                            dispatch,
                                            resolve,
                                            dataType,
                                            payload,
                                            settings
                                        );
                                    })
                            }
                        });
                    }
                }

                if (error  || !isJSON(data)) {
                    dispatch({
                        type: 'READING_' + dataType.toUpperCase() + '_FAILED',
                        payload: error
                    });
                    reject('readingStorageFailed');
                    return;
                }

                readStoreSuccess(
                    dispatch,
                    resolve,
                    dataType,
                    payload,
                    JSON.parse(data)
                );
            });
        });
    }
};
