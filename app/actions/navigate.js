// @flow
import { push } from 'react-router-redux'

export default function navigate(payload) {
    return function(dispatch) {
        dispatch(push(payload.join('/')));
    }
};
