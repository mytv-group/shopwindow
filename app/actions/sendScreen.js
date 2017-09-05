import sprintf from 'utils/sprintf';
import { remote } from 'electron';

export default function sendScreen(payload) {
    return (dispatch) => {
        dispatch({
            type: 'SEND_SCREEN_START',
            payload: payload
        });

        return new Promise((resolve, reject) => {
            let url = payload.url + sprintf('/interface/storeScreen/');

            try {
                remote.getCurrentWindow().capturePage((buf) => {
                        let formData = new FormData();
                        const blob = new Blob([new Uint8Array(buf.toPng())], {type: "image/png"});

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

                        fetch(url, options)
                            .then(
                                () => {
                                    dispatch({
                                        type: 'SEND_SCREEN_COMPLETE'
                                    });

                                    resolve();
                                }
                            ).catch((exception) => {
                                throw Error(exception);
                            });
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
