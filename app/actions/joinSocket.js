// @flow
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import { bindActionCreators } from 'redux';

import schedule from 'action-chains/schedule';

export default function joinSocket(payload) {
    return function(dispatch) {
        var io = sailsIOClient(socketIOClient);
        io.sails.url = payload.url;
        io.sails.reconnection = true;

        io.socket.on('connect', () => {
            io.socket.get(
                [payload.url, '/point/register', '?id=', payload.id].join('')
            );
        });

        io.socket.on('updateContent', () => {
            bindActionCreators(schedule, dispatch)();
            bindActionCreators(requestWidgetsPlan, dispatch)();
        });
    }
};
