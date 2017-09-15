// @flow
import { push } from 'react-router-redux'

export default function setCurrentMedia(payload) {
    return function(dispatch) {
        dispatch({
            type: 'CURRENT_MEDIA',
            payload: payload
        });
    }
};
