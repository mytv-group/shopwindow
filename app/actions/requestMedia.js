// @flow
import fs from 'fs';
import http from 'http';
import { remote }  from  'electron';
import dateFormat from 'dateformat';
import C from 'constants/list';

//remote.app.getPath('userData')
//lnx  ~/.config/RtvShopwindow
//win C:\Users\Admin\AppData\Roaming\RtvShopwindow

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
                url,
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

function copyFile(oldPath, newPath) {
    return new Promise((resolve, reject) => {
        try {
            let request = fs.createReadStream(oldPath)
                .pipe(fs.createWriteStream(newPath))
                .on('finish', () => resolve(request));
        } catch(exception) {
            reject(exception);
        }
    });
}

function pushFileToMedia(
    uploadingDfdArray,
    fileDescriptor,
    pointId,
    channel,
    date
) {
    let dataPath = remote.app.getPath('userData'),
        todayFolder = dateFormat(date, 'yyyymmdd'),
        yesterdayFolder = dateFormat((d => new Date(d.getDate()-1))(date), 'yyyymmdd'),
        filePath = [dataPath, C.spoolPathName, pointId, todayFolder, fileDescriptor.name].join('/'),
        previousPath = [dataPath, C.spoolPathName, pointId, yesterdayFolder, fileDescriptor.name].join('/'),
        fileSizeInBytes = -1,
        previousFileSizeInBytes = -1;

    createDirectory(dataPath, [C.spoolPathName, pointId, todayFolder]);

    if (fs.existsSync(filePath)) {
        fileSizeInBytes = fs.statSync(filePath).size;
    }

    if (fs.existsSync(previousPath)) {
        previousFileSizeInBytes = fs.statSync(previousPath).size;
    }

    /*
     * Already downloaded and correct size - do nothing
     */
    if (fileSizeInBytes === fileDescriptor.size) {
        return {
            name: fileDescriptor.name,
            path: filePath,
            channel: channel
        };
    }

    /*
     * Already downloaded previous, just copy
     */
    if ((fileSizeInBytes !== fileDescriptor.size)
        && (fileDescriptor.size === previousFileSizeInBytes)
    ) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        uploadingDfdArray.push(
            copyFile(previousPath, filePath)
        );

        return {
            name: fileDescriptor.name,
            path: filePath,
            channel: channel
        };
    }

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    uploadingDfdArray.push(
        requestFile(filePath, fileDescriptor.url, pointId, channel)
    );

    return {
        name: fileDescriptor.name,
        path: filePath,
        channel: channel
    };
}

export default function requestMedia(payload = {}) {
    return (dispatch) => {
        dispatch({
            type: 'REQUESTING_MEDIA_START',
            payload: payload
        });

        let url = payload.url,
            pointId = payload.pointId,
            backgroundFiles = payload.backgroundFiles,
            advertisingFiles = payload.advertisingFiles,
            date = new Date(),
            uploadingDfdArray = [],
            mediaFiles = [];

        if ((typeof payload.date === 'string')
            && (payload.date.length === 8)
        ) {
            date = new Date(
                payload.date.substring(0, 4),
                parseInt(payload.date.substring(4, 6)) - 1,
                payload.date.substring(6, 8)
            );
        }

        backgroundFiles.forEach((fileDescriptor) => {
            mediaFiles.push(
                pushFileToMedia(
                    uploadingDfdArray,
                    fileDescriptor,
                    pointId,
                    C.backgroundChannel,
                    date
                )
            );
        });

        advertisingFiles.forEach((fileDescriptor) => {
            mediaFiles.push(
                pushFileToMedia(
                    uploadingDfdArray,
                    fileDescriptor,
                    pointId,
                    C.advertisingChannel,
                    date
                )
            );
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
