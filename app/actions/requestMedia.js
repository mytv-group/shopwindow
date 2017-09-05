// @flow
import fs from 'fs';
import http from 'http';
import { remote }  from  'electron';
import dateFormat from 'dateformat';

const SPOOL_PATH_NAME = 'spool';
const POINTS_PATH_NAME = 'points';
const BACKGROUND_CHANNEL = 1;
const ADVERTISING_CHANNEL = 2;

function createDirectory(initialPath, pathArr) {
    if (pathArr.length === 0) {
        return;
    }

    let directory = initialPath + '/' + pathArr[0];

    try {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory)
        }

        createDirectory(
            directory,
            pathArr.splice(1, pathArr.length - 1)
        );
    } catch(exception) {
        return;
    }
}

function requestFile(filePath, url, pointId, channel) {
    let fileName = filePath.replace(/^.*(\\|\/|\:)/, '');
    let stream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
        try {
            let request = http.get(
                [
                    url,
                    SPOOL_PATH_NAME,
                    POINTS_PATH_NAME,
                    pointId,
                    channel,
                    fileName
                ].join('/'),
                (response) => {
                    response
                        .pipe(stream)
                        .on('finish', () => resolve(request));
                }
            );
        } catch(exception) {
            reject(exception);
        }
    });
}

export default function requestMedia(payload = {}) {
    return (dispatch) => {
        dispatch({
            type: 'REQUESTING_MEDIA_START',
            payload: payload
        });

        let url = payload.url;
        let backgroundFiles = payload.backgroundFiles;
        let advertisingFiles = payload.advertisingFiles;
        let dataPath = remote.app.getPath('userData');
        let pointId = payload.pointId || dateFormat(new Date(), 'yyyymmdd');
        let date = payload.data || dateFormat(new Date(), 'yyyymmdd');

        createDirectory(dataPath, [SPOOL_PATH_NAME, pointId, date]);

        let uploadingDfdArray = [];
        let mediaFiles = [];

        backgroundFiles.forEach((fileName) => {
            let filePath = [dataPath, SPOOL_PATH_NAME, pointId, date, fileName].join('/');

            mediaFiles.push({
                name: fileName,
                path: filePath,
                channel: BACKGROUND_CHANNEL
            });

            if (!fs.existsSync(filePath)) {
                uploadingDfdArray.push(
                    requestFile(filePath, url, pointId, BACKGROUND_CHANNEL)
                );
            }
        });

        advertisingFiles.forEach((fileName) => {
            let filePath = [dataPath, SPOOL_PATH_NAME, pointId, date, fileName].join('/');

            mediaFiles.push({
                name: fileName,
                path: filePath,
                channel: ADVERTISING_CHANNEL
            });

            if (!fs.existsSync(filePath)) {
                uploadingDfdArray.push(
                    requestFile(filePath, url, pointId, ADVERTISING_CHANNEL)
                );
            }
        });

        // using wraping Promise to pass necessary on resolve
        return new Promise((resolve, reject) =>
            Promise.all(uploadingDfdArray).then(
                () => {
                    dispatch({
                        type: 'REQUESTING_MEDIA_COMPLETE',
                        payload: {
                            mediaFiles: mediaFiles
                        }
                    });
                    resolve(mediaFiles);
                },
                () => {
                    dispatch({
                        type: 'REQUESTING_MEDIA_FAILED'
                    });
                    reject('requestingMediaFailed');
                },
            )
        );
    }
};
