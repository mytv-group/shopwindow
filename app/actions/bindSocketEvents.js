// @flow
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import { bindActionCreators } from 'redux';
import { remote } from 'electron';

import schedule from 'action-chains/schedule';
import requestWidgetsPlan from 'actions/requestWidgetsPlan';
import sendScreen from 'actions/sendScreen';

export default function bindSocketEvents(payload) {
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
            bindActionCreators(schedule, dispatch)({}, true);
            bindActionCreators(requestWidgetsPlan, dispatch)({
                id: payload.id,
                url: payload.serverUrl
            });
        });

        io.socket.on('sendScreen', () => {
            bindActionCreators(sendScreen, dispatch)({
                id: payload.id,
                url: payload.serverUrl
            });
        });

        io.socket.on('broadcastReload', () => {
            location.reload();

            let window = remote.getCurrentWindow();
            window.setAlwaysOnTop(false);
            if (process.env.NODE_ENV !== 'development') {
                window.setAlwaysOnTop(true);
            }

        });
    }
};
