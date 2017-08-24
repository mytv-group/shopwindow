// @flow
import fs from 'fs';
import { remote }  from  'electron';
import dateFormat from 'dateformat';

const SPOOL_PATH_NAME = 'spool';

export default function scanMedia(payload = {}) {
    return (dispatch) => {
        dispatch({
            type: 'SCANNING_MEDIA_START',
            payload: payload
        });

        dispatch({
            type: 'SCANNING_MEDIA_COMPLETE',
            payload: { items: [] }
        });

    }
};
