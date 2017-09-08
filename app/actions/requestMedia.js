// @flow
import fs from 'fs';
import http from 'http';
import { remote }  from  'electron';
import dateFormat from 'dateformat';
import C from 'constants/main';

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
                    C.spoolPathName,
                    C.pointsPathName,
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
        let pointId = payload.pointId;
        let backgroundFiles = payload.backgroundFiles;
        let advertisingFiles = payload.advertisingFiles;

        let dataPath = remote.app.getPath('userData');
        let date = payload.data || dateFormat(new Date(), 'yyyymmdd');

        createDirectory(dataPath, [C.spoolPathName, pointId, date]);

        let uploadingDfdArray = [];
        let mediaFiles = [];

        backgroundFiles.forEach((fileName) => {
            let filePath = [dataPath, C.spoolPathName, pointId, date, fileName].join('/');

            mediaFiles.push({
                name: fileName,
                path: filePath,
                channel: C.backgroundChannel
            });

            if (!fs.existsSync(filePath)) {
                uploadingDfdArray.push(
                    requestFile(filePath, url, pointId, C.backgroundChannel)
                );
            }
        });

        advertisingFiles.forEach((fileName) => {
            let filePath = [dataPath, C.spoolPathName, pointId, date, fileName].join('/');

            mediaFiles.push({
                name: fileName,
                path: filePath,
                channel: C.advertisingChannel
            });

            if (!fs.existsSync(filePath)) {
                uploadingDfdArray.push(
                    requestFile(filePath, url, pointId, C.advertisingChannel)
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
