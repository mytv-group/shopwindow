 // @flow
import fs from 'fs';
import { remote } from 'electron';
import rimraf from 'rimraf';
import dateFormat from 'dateformat';
import C from 'constants/list';

export default function cleanMedia(payload = {}) {
    return (dispatch) => {
        dispatch({
            type: 'CLEAN_MEDIA_START',
            payload: payload
        });

        return new Promise((resolve, reject) => {
            try {
                let pointId = payload.pointId;
                let dataPath = remote.app.getPath('userData');
                let path = [dataPath, C.spoolPathName, pointId].join('/');

                if (!fs.existsSync(path)) {
                    dispatch({
                        type: 'CLEAN_MEDIA_COMPLETE',
                        payload: payload
                    });
                    resolve();
                }

                let today = dateFormat(new Date(), 'yyyymmdd');

                let folders = fs.readdirSync(path);
                folders.forEach((item) => {
                    if (item !== today) {
                        rimraf.sync([path, item].join('/'));
                    }
                });

                dispatch({
                    type: 'CLEAN_MEDIA_COMPLETE',
                    payload: payload
                });
                resolve();
            } catch(exception) {
                dispatch({
                    type: 'CLEAN_MEDIA_FAILED',
                    payload: payload
                });
                reject(exception);
            }
        });
    }
};
