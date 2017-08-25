// @flow
const initialState = {
    isReading: null,
    isRequesting: null,
    isBadRequest: false,
    isNotFound: false,
    table: null,
    backgroundFiles: [],
    advertisingFiles: []
};

export default function schedule(state = initialState, action) {
    switch (action.type) {
        case 'READING_SCHEDULE_START':
            return { ...state, ...{ isReading: true } };
        case 'READING_SCHEDULE_COMPLETE':
            return { ...state,
                ...{
                    isReading: false,
                    table: action.payload.table || [],
                    backgroundFiles: action.payload.backgroundFiles || [],
                    advertisingFiles: action.payload.advertisingFiles || []
                }
            };
        case 'READING_SCHEDULE_FAILED':
            return state;
        case 'REQUESTING_SCHEDULE_START':
            return { ...state, ...{
                isRequesting: true,
                isBadRequest: false,
                isNotFound: false,
            } };
        case 'REQUESTING_SCHEDULE_COMPLETE':
            return { ...state,
                ...{
                    isRequesting: false,
                    isBadRequest: false,
                    isNotFound: false,
                    table: action.payload.response.table || [],
                    backgroundFiles: action.payload.response.backgroundFiles || [],
                    advertisingFiles: action.payload.response.advertisingFiles || []
                }
            };
        case 'REQUESTING_SCHEDULE_FAILED':
            if (action.payload.response.status === 400) {
                return { ...state,
                    ...{
                        isRequesting: false,
                        isBadRequest: true
                    }
                };
            } else if (action.payload.response.status === 404) {
                return { ...state,
                    ...{
                        isRequesting: false,
                        isNotFound: true
                    }
                };
            }

            return { ...state,
                ...{
                    isRequesting: false,
                    table: [],
                    backgroundFiles: [],
                    advertisingFiles: []
                }
            };
        default:
            return state;
    }
}
