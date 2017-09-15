// @flow
import { bindActionCreators } from 'redux';

import readStore from 'actions/readStore';
import checkSettings from 'actions/checkSettings';
import bindSocketEvents from 'actions/bindSocketEvents';

export default function joinSocket(payload) {
    return function(dispatch) {
        let chain = {
            readStore: bindActionCreators(readStore, dispatch),
            checkSettings: bindActionCreators(checkSettings, dispatch),
            bindSocketEvents: bindActionCreators(bindSocketEvents, dispatch)
        };

        return new Promise((resolve, reject) => {
            chain.readStore('settings')
                .then(
                    (settings) => {
                        return chain.checkSettings(settings.result);
                    },
                    (message) => reject(message)
                )
                .then(
                    (settings) => {
                        return chain.bindSocketEvents({
                            id: settings.pointId,
                            serverUrl: settings.serverUrl,
                            interactionUrl: settings.interactionUrl
                        });
                    },
                    (message) => reject(message)
                )
            });
    }
};
