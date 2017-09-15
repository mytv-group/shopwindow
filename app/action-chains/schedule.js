// @flow
import { bindActionCreators } from 'redux';
import dateFormat from 'dateformat';

import readStore from 'actions/readStore';
import checkSettings from 'actions/checkSettings';
import requestSchedule from 'actions/requestSchedule';
import requestMedia from 'actions/requestMedia';
import cleanMedia from 'actions/cleanMedia';

export default function schedule(
    payload,
    silent = false // do not dispatch to redux if true
) {
    return function(realDispatch) {
        let dispatch = realDispatch;
        if (silent) {
            // dummy dispatch
            dispatch = (func) => func(() => {});
        }

        let chain = {
            // chain global attr
            settings: null,
            schedule: null,
            media: null,

            //chain promise functions
            readStore: bindActionCreators(readStore, dispatch),
            checkSettings: bindActionCreators(checkSettings, dispatch),
            requestSchedule: bindActionCreators(requestSchedule, dispatch),
            requestMedia: bindActionCreators(requestMedia, dispatch),
            cleanMedia: bindActionCreators(cleanMedia, dispatch)
        };

        return new Promise((resolve, reject) => {
            chain.readStore('settings')
                .then(
                    (settings) => {
                        chain.settings = settings.result;
                        return chain.checkSettings(chain.settings);
                    },
                    (message) => reject(message)
                )
                .then(
                    (settings) => {
                        return chain.requestSchedule({
                            url: settings.serverUrl,
                            id: settings.pointId,
                            date: dateFormat(new Date(), 'yyyymmdd')
                        });
                    },
                    (message) => reject(message)
                )
                .then(
                    (schedule) => {
                        chain.schedule = schedule;
                        return chain.requestMedia({
                            url: chain.settings.serverUrl,
                            pointId: chain.settings.pointId,
                            date: dateFormat(new Date(), 'yyyymmdd'),
                            backgroundFiles: schedule.backgroundFiles,
                            advertisingFiles: schedule.advertisingFiles
                        });
                    },
                    (message) => reject(message)
                )
                .then(
                    (media) => {
                        chain.media = media;
                        return chain.cleanMedia({
                            pointId: chain.settings.pointId,
                            date: dateFormat(new Date(), 'yyyymmdd')
                        });
                    },
                    (message) => reject(message)
                )
                .then(
                    () => {
                        if (silent) {
                            realDispatch({
                                type: 'READING_SETTINGS_COMPLETE',
                                payload: chain.settings
                            });

                            realDispatch({
                                type: 'REQUESTING_SCHEDULE_COMPLETE',
                                payload: {
                                    request: {},
                                    response: chain.schedule
                                }
                            });

                            realDispatch({
                                type: 'REQUESTING_MEDIA_COMPLETE',
                                payload: {
                                    mediaFiles: chain.media
                                }
                            });
                        }

                        resolve({
                            settings: chain.settings,
                            schedule: chain.schedule,
                            media: chain.media
                        });
                    },
                    (message) => reject(message)
                );
        });
    }
};
