import sprintf from 'utils/sprintf';
import { remote } from 'electron';
import sharp from 'sharp';

import C from 'config/constants';

export default function sendScreen(payload) {
    return (dispatch) => {
        dispatch({
            type: 'SEND_SCREEN_START',
            payload: payload
        });

        return new Promise((resolve, reject) => {
            let url = payload.url + sprintf('/interface/storeScreen/');

            try {
                return new Promise((resolve, reject) => {
                        try {
                            remote.getCurrentWindow()
                                .capturePage((buf) => {
                                    resolve(buf);
                                });
                        } catch (exception) {
                            reject(exception);
                        }
                    })
                    .then((buf) => {
                        return sharp(buf.toPng())
                            .resize(C.screenShotWidth, C.screenShotHeight)
                            .toBuffer();
                    })
                    .then((pngBuffer) => {
                        let formData = new FormData();
                        const blob = new Blob([new Uint8Array(pngBuffer)], {type: "image/png"});

                        formData.append('screen', blob, 'screenshot.png');
                        formData.append('id', payload.id);

                        let options = {
                            credentials: 'same-origin',
                            method: 'post',
                            headers: {
                                'pragma': 'no-cache',
                                'cache-control': 'no-cache'
                            },
                            body: formData
                        };

                        return fetch(url, options);
                    })
                    .then(() => {
                        dispatch({
                            type: 'SEND_SCREEN_COMPLETE'
                        });

                        resolve();
                    }).catch((exception) => {
                        throw Error(exception);
                    });
            } catch(exception) {
                dispatch({
                    type: 'SEND_SCREEN_FAILED',
                    payload: exception
                });

                reject(exception);
            }
        });
    }
}
