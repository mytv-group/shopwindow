import sprintf from 'utils/sprintf';

export default function requestWidgetsPlan(payload) {
    return (dispatch) => {
        dispatch({
            type: 'GET_WIDGETS_PLAN_START',
            payload: payload
        });

        return new Promise((resolve, reject) => {
            let url = payload.url + sprintf('/interface/getWidgets/id/%%', payload.id);
            let options = {
                credentials: 'same-origin',
                method: 'get'
            };

            try {
                fetch(url, options)
                    .then(
                        (response) => {
                            if (response.status === 200) {
                                response.json().then(
                                    (json) => {
                                        let items = json.widgets || [];

                                        dispatch({
                                            type: 'GET_WIDGETS_PLAN_COMPLETE',
                                            payload: { items: items }
                                        });

                                        resolve({ items: items });
                                    }, (response) => {
                                        throw Error(response);
                                    }
                                );
                            } else {
                                throw Error(response.status);
                            }
                        }
                    ).catch((exception) => {
                        throw Error(exception);
                    });
            } catch(exception) {
                dispatch({
                    type: 'GET_WIDGETS_PLAN_FAILED',
                    payload: exception
                });

                reject(exception);
            }
        });
    }
}
