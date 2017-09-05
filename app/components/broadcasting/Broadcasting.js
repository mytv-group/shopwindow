// @flow
import styles from './broadcasting.scss';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';

import InvalidOverlay from 'controls/invalid-overlay/InvalidOverlay';
import PreparingOverlay from 'controls/preparing-overlay/PreparingOverlay';
import Player from 'components/broadcasting/player/Player';
import WidgetsContainer from 'components/broadcasting/widgets-container/WidgetsContainer';

import navigate from 'actions/navigate';

const SECONDS_IN_DAY = 86400;

class Broadcasting extends Component {
    constructor(props) {
        super(props);

        this.updateMediaTimeout = null;

        if ((this.props.schedule === null)
            || (this.props.media === null)
        ) {
            return this;
        }

        let currentScheduleItem = this.getScheduleItem(
            this.props.schedule,
            this.props.media
        );

        if (currentScheduleItem) {
            this.state = currentScheduleItem;
        }
    }

    getTimeInSeconds(arg = null) {
        let date = arg || dateFormat(new Date(), 'HH:MM:ss');
        let splited = date.split(':');
        return (+splited[0]) * 60 * 60 + (+splited[1]) * 60 + (+splited[2]);
    }

    getSheduleItemPath (name, media) {
        let index = media.findIndex((element, index, array) => {
            return (element.name === name);
        });

        if (index === -1) {
            return null;
        }

        return media[index].path;
    }

    getScheduleItem(schedule, media, dailyTimestamp = null) {
        let seconds = dailyTimestamp || this.getTimeInSeconds();
        let index = schedule.findIndex((element, index, array) => {
            return ((element.startTimestamp <= seconds)
                && (element.endTimestamp >= seconds));
        });

        if (index === -1) {
            return null;
        }

        let path = this.getSheduleItemPath(schedule[index].name, media);

        if (path === null) {
            throw Error('Schedule file not found in media');
        }

        let secondsToNext = (schedule[index].endTimestamp - seconds);
        let secondsToEnd = schedule[index].endTimestamp;

        if (secondsToEnd >= SECONDS_IN_DAY) {
            secondsToEnd -= SECONDS_IN_DAY;
        }

        return {
            secondsToNext: secondsToNext,
            secondsToEnd: schedule[index].endTimestamp,
            videoOffset: seconds - schedule[index].startTimestamp,
            path: path,
        }
    }

    componentDidMount() {
        if ((this.props.schedule === null)
            || (this.props.media === null)
        ) {
            this.props.navigate(['/']);
            return;
        }

        this.prepareNextMedia(
            this.props.schedule,
            this.props.media,
            this.state.secondsToNext
        );
    }

    componentWillReceiveProps() {
        if (this.updateMediaTimeout) {
            clearInterval(this.updateMediaTimeout);
        }
    }

    componentDidUpdate() {
        this.prepareNextMedia(
            this.props.schedule,
            this.props.media,
            this.state.secondsToNext
        );
    }

    prepareNextMedia(schedule, media, secondsToNext) {
        this.updateMediaTimeout = setTimeout(() => {
            let currentScheduleItem = this.getScheduleItem(
                this.props.schedule,
                this.props.media,
                this.state.secondsToEnd + 0.1
            );

            if (currentScheduleItem) {
                this.setState(currentScheduleItem);
            }
        }, secondsToNext * 1000);
    }

    render() {
        if ((this.props.schedule === null)
            || (this.props.media === null)
        ) {
            return <PreparingOverlay
                   task='Preparing schedule'
               />;
        }

        if (this.props.schedule.length === 0) {
            return (
                <InvalidOverlay
                    reason='No planed content'
                />
            )
        }

        if (!this.state.path) {
            return (
                <InvalidOverlay
                    reason='Neccesary content was not uploaded'
                />
            )
        }

        return (
            <div className={ styles.container }>
                <Player
                    path={ this.state.path }
                    offset={ this.state.videoOffset }
                />
                <WidgetsContainer/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        schedule: state.schedule.table,
        media: state.media.items
    };
}

function mapDispatchToProps(dispatch) {
    return {
        navigate: bindActionCreators(navigate, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Broadcasting);
