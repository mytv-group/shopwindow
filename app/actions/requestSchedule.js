// @flow
import sprintf from 'utils/sprintf';

let ScheduleFormater = {
    splitRawData: function(rawData) {
        let delimiter = '\n';
        if (rawData.indexOf('<br>') !== -1) {
            delimiter = '<br>';
        }

        return rawData.split(delimiter);
    },

    splitToBlocks: function (rawData) {
        let splitedByDelimiter = this.splitRawData(rawData);

        let splitedByBlocks = [];
        let stack = [];
        let timeStart = '00:00:00';

        splitedByDelimiter.forEach((item) => {
            if (item.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)) {
                timeStart = item;
            } else if (item !== '') {
                let line = item.split(' ');

                if (line.length >= 3) {
                    stack.push({
                        name: line[1],
                        duration: parseInt(line[0], 10),
                        meta: line[2]
                    });
                }
            }

            if ((item === '') && (stack.length > 0)) {
                splitedByBlocks.push({
                    begin: timeStart,
                    items: stack.slice()
                });
                stack = [];
            }
        })

        return splitedByBlocks;
    },

    fillBgBlocksWithEnd: function (splitedByBlocks) {
        let blocksWithEnd = [];

        for (let ii = 0; ii < (splitedByBlocks.length - 1); ii++) {
            blocksWithEnd.push({
                ...splitedByBlocks[ii],
                ...{
                    end: splitedByBlocks[ii + 1]['begin'] || '00:00:00'
                }
            });
        }

        if (splitedByBlocks.length > 0) {
            blocksWithEnd.push({
                ...splitedByBlocks[splitedByBlocks.length - 1],
                ...{
                    end: '23:59:59'
                }
            });
        }

        // to start with 00:00:00 always
        if (splitedByBlocks.length > 0) {
            blocksWithEnd[0].begin = '00:00:00';
        }

        return blocksWithEnd;
    },

    advBlocksToTimeBlocks: function (splitedByBlocks) {
        let table = [];
        for (let ii = 0; ii < (splitedByBlocks.length - 1); ii++) {
            let block = splitedByBlocks[ii];
            let beginTimestamp = this.timeToSeconds(block.begin);
            let trackTime = beginTimestamp;
            let advBlockItems = [];

            for (let jj = 0; jj < block.items.length; jj++) {
                let track = block.items[jj];
                let duration = parseInt(track.duration, 10);

                advBlockItems.push({
                     ...track, ...{
                        startTime: this.secondsToTime(trackTime),
                        startTimestamp: trackTime,
                        endTime: this.secondsToTime(trackTime + duration),
                        endTimestamp: (trackTime + duration),
                        type: 'adv'
                    }
                });

                trackTime += duration;
            }

            table.push({
                startBlockTime: this.secondsToTime(beginTimestamp),
                startBlockTimestamp: beginTimestamp,
                endBlockTime: this.secondsToTime(trackTime),
                endBlockTimestamp: (trackTime),
                items: advBlockItems
            });
        }

        return table;
    },

    concatSequentialAdvBlovks(splitedByBlocks) {
        let concated = [];

        if (splitedByBlocks.length > 0) {
            concated.push(splitedByBlocks[0]);
        }

        for (let ii = 1; ii < splitedByBlocks.length; ii++) {
            let curBlock = splitedByBlocks[ii];
            let lastConcated = concated[concated.length - 1];

            if (lastConcated.endBlockTimestamp === curBlock.startBlockTimestamp) {
                concated[concated.length - 1] = { ...lastConcated, ...{
                    items: lastConcated.items.concat(curBlock.items),
                    endBlockTime: curBlock.endBlockTime,
                    endBlockTimestamp: curBlock.endBlockTimestamp
                }};
            } else {
                concated.push(curBlock);
            }
        }

        return concated;
    },

    timeToSeconds: function (hms) {
        let splited = hms.split(':');
        return (+splited[0]) * 60 * 60 + (+splited[1]) * 60 + (+splited[2]);
    },

    secondsToTime: function (stamp) {
        let secNum = parseInt(stamp, 10);
        let hours   = Math.floor(secNum / 3600);
        let minutes = Math.floor((secNum - (hours * 3600)) / 60);
        let seconds = secNum - (hours * 3600) - (minutes * 60);

        if (hours   < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        return hours + ':' + minutes + ':' + seconds;
    },

    blocksToTable: function (blocks) {
        let table = [];

        blocks.forEach((block) => {
            let trackTime = this.timeToSeconds(block.begin);
            let endBlockTime = this.timeToSeconds(block.end);
            let trackNum = 0;

            while (trackTime < endBlockTime) {
                let track = block.items[trackNum];
                let duration = parseInt(track.duration, 10);

                table.push({
                    ...{
                        startTime: this.secondsToTime(trackTime),
                        startTimestamp: trackTime,
                        endTime: this.secondsToTime(trackTime + duration),
                        endTimestamp: (trackTime + duration),
                        type: 'bg'
                    }, ...track
                });
                trackTime += duration;

                if (trackNum >= block.items.length - 1) {
                    trackNum = 0;
                } else {
                    trackNum++;
                }
            }
        });

        return table;
    },

    formatBgBlocks: function (rawData) {
        let splitedByBlocks = this.splitToBlocks(rawData);
        let blocksWithEnd = this.fillBgBlocksWithEnd(splitedByBlocks);
        let schedule = this.blocksToTable(blocksWithEnd);

        return schedule;
    },

    formatAdvBlocks: function (rawData) {
        let splitedByBlocks = this.splitToBlocks(rawData);
        let timeBlocks = this.advBlocksToTimeBlocks(splitedByBlocks);

        return this.concatSequentialAdvBlovks(timeBlocks);
    },

    getBgOnInterval: function (bgTable, fromTime, toTime) {
        let earlierBg = [];
        let item = {};

        for (let ii = 0; ii < bgTable.length; ii++) {
            item = bgTable[ii];

            if ((item.startTimestamp <= fromTime)
                && (item.endTimestamp > fromTime)
                && (item.endTimestamp < toTime)
            ) {
                earlierBg.push({
                    ...item, ...{
                        startTime: this.secondsToTime(fromTime),
                        startTimestamp: (fromTime),
                        duration: (item.endTimestamp - fromTime)
                    }
                });
            }

            if ((item.startTimestamp > fromTime)
                && (item.startTimestamp < toTime)
                && (item.endTimestamp < toTime)
            ) {
                earlierBg.push(item);
            }

            if ((item.startTimestamp > fromTime)
                && (item.startTimestamp < toTime)
                && (item.endTimestamp >= toTime)
            ) {
                earlierBg.push({
                    ...item, ...{
                        endTime: this.secondsToTime(toTime),
                        endTimestamp: (toTime),
                        duration: (item.endTimestamp - toTime)
                    }
                });
            }

            if ((item.startTimestamp <= fromTime)
                && (item.startTimestamp < toTime)
                && (item.endTimestamp > fromTime)
                && (item.endTimestamp >= toTime)
            ) {
                earlierBg.push({
                    ...item, ...{
                        startTime: this.secondsToTime(fromTime),
                        startTimestamp: (fromTime),
                        duration: (toTime - fromTime),
                        endTime: this.secondsToTime(toTime),
                        endTimestamp: (toTime),
                    }
                });
            }

            if (item.startTimestamp > toTime) {
                break;
            }
        }

        if ((earlierBg.length === 0)
            && (fromTime !== toTime)
        ) {
            let insuranceItem = {};

            if (bgTable.length > 0) {
                insuranceItem = bgTable[0];
            }

            if (Object.getOwnPropertyNames(item).length > 0) {
                insuranceItem = item;
            }

            earlierBg.push({
                ...insuranceItem, ...{
                    startTime: this.secondsToTime(fromTime),
                    startTimestamp: (fromTime),
                    duration: (toTime - fromTime),
                    endTime: this.secondsToTime(toTime),
                    endTimestamp: (toTime),
                }
            });
        }



        return earlierBg;
    },

    merge: function (bgTable, advBlocks) {
        let schedule = [];

        if (bgTable.length === 0) {
            throw Exception('Empty background timeschedule');
        }

        let earlierFromTime = 0;
        for (let ii = 0; ii < advBlocks.length; ii++) {
            let advBlock = advBlocks[ii];
            let earlierBg = this.getBgOnInterval(bgTable, earlierFromTime, advBlock.startBlockTimestamp);

            earlierFromTime = advBlock.endBlockTimestamp;
            schedule = schedule.concat(earlierBg, advBlock.items);
        }

        let laterBg = this.getBgOnInterval(bgTable, earlierFromTime, this.timeToSeconds('23:59:59'));
        if (laterBg) {
            schedule = schedule.concat(laterBg);
        }

        return schedule;
    },

    getFileNames(rawData) {
        let splitedByDelimiter = this.splitRawData(rawData);
        let lines = [];

        splitedByDelimiter.forEach((item) => {
            if (!item.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
                && (item !== '')
            ) {
                let line = item.split(' '),
                    meta = line[2],
                    splitedMeta = meta.split(';'),
                    size = 0,
                    url = '';

                for (let index in splitedMeta) {
                    let item = splitedMeta[index];

                    if (item.indexOf('url') !== -1) {
                        url = item.replace('url:', '');
                    }

                    if (item.indexOf('size') !== -1) {
                        size = parseInt(item.replace('size:', ''));
                    }
                }

                if ((line.length >= 3) && (lines.indexOf(line[1]) === -1)) {
                    let existedIndex = lines.findIndex((element) => {
                        return element.name === line[1];
                    });

                    if (existedIndex === -1) {
                        lines.push({
                            name: line[1],
                            size: size,
                            url: url
                        });
                    }
                }
            }
        })

        return lines;
    }
};

function request(url) {
    let options = {
        credentials: 'same-origin',
        method: 'get',
        headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        }
    };

    return new Promise((resolve, reject) => {
        try {
            fetch(url, options)
            .then(
                (response) => {
                    if (response.status === 200) {
                        response.text().then((text) => {
                                resolve(text);
                            }, () => {
                                reject(response.status);
                            }
                        );
                    } else {
                        reject(response.status);
                    }
                }
            ).catch((exception) => {
                reject(exception)
            });
        } catch(exception) {
            reject(500);
        }
    });
}

export default function requestSchedule(
    payload = {}
) {
    return function(dispatch) {
        dispatch({
            type: 'REQUESTING_SCHEDULE_START',
            payload: payload
        });

        let urlBg = payload.url + sprintf('/interface/getPointSchedule/id/%%/ch/1/date/%%',
            payload.id, payload.date
        );

        let urlAdv = payload.url + sprintf('/interface/getPointSchedule/id/%%/ch/2/date/%%',
            payload.id, payload.date
        );

        let bgRequestPromise = request(urlBg);
        let advRequestPromise = request(urlAdv);

        // cant use Promise.all bacause forbidden fail all request in case
        // adv channel empty
        // so if bgRequestPromiformatBlocksse resolved - resolves action

        return new Promise((resolve, reject) => {
            bgRequestPromise.then(
                (bgRawSchedule) => {
                    let backgroundFiles = ScheduleFormater.getFileNames(bgRawSchedule);
                    let advertisingFiles = [];

                    advRequestPromise.then(
                        (advRawSchedule) => {
                            let bgTimeschedule = ScheduleFormater.formatBgBlocks(bgRawSchedule);
                            let advertisingFiles = ScheduleFormater.getFileNames(advRawSchedule);
                            let table = [];
                            if (bgTimeschedule.length === 0) {
                                table = ScheduleFormater.formatBgBlocks(advRawSchedule);
                            } else {
                                let advBlocks = ScheduleFormater.formatAdvBlocks(advRawSchedule);
                                table = ScheduleFormater.merge(bgTimeschedule, advBlocks);
                            }

                            let response = {
                                table: table,
                                backgroundFiles: backgroundFiles,
                                advertisingFiles: advertisingFiles
                            };

                            dispatch({
                                type: 'REQUESTING_SCHEDULE_COMPLETE',
                                payload: {
                                    request: payload,
                                    response: response
                                }
                            });

                            resolve(response);
                        },
                        (status) => {
                            let response = {
                                table: ScheduleFormater.formatBgBlocks(bgRawSchedule),
                                backgroundFiles: backgroundFiles,
                                advertisingFiles: advertisingFiles
                            };

                            dispatch({
                                type: 'REQUESTING_SCHEDULE_COMPLETE',
                                payload: {
                                    request: payload,
                                    response:response
                                }
                            });

                            resolve(response);
                        }
                    );
                },
                (status) => {
                    dispatch({
                        type: 'REQUESTING_SCHEDULE_FAILED',
                        payload: {
                            request: payload,
                            response: { status: status }
                        }
                    });

                    reject('requestingSheduleFailed');
                }
            );
        });
    }
};
