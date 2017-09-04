// @flow
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import { bindActionCreators } from 'redux';

import schedule from 'action-chains/schedule';
import requestWidgetsPlan from 'actions/requestWidgetsPlan';

export default function joinSocket(payload) {
    return function(dispatch) {
        var io = sailsIOClient(socketIOClient);
        io.sails.url = payload.interactionUrl;
        io.sails.reconnection = true;

        io.socket.on('connect', () => {
            io.socket.get(
                [payload.interactionUrl, '/point/register', '?id=', payload.id].join('')
            );
        });

        io.socket.on('updateContent', () => {
            bindActionCreators(schedule, dispatch)();
            bindActionCreators(requestWidgetsPlan, dispatch)({
                id: payload.id,
                url: payload.serverUrl
            });
        });
    }
};
