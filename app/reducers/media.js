// @flow
const initialState = {
    isScanning: null,
    isRequesting: null,
    isRequestingFailed: false,
    items: null
};

export default function media(state = initialState, action) {
  switch (action.type) {
    case 'SCANNING_MEDIA_START':
        return { ...state, ...{ isScanning: true } };
    case 'SCANNING_MEDIA_COMPLETE':
        return { ...state,
            ...{
                isScanning: false,
                items: action.payload.items || []
            }
        };
    case 'REQUESTING_MEDIA_START':
        return { ...state, ...{
            isRequesting: true,
            isRequestingFailed: false
        } };
    case 'REQUESTING_MEDIA_COMPLETE':
        return { ...state,
            ...{
                isRequesting: false,
                isRequestingFailed: false,
                items: action.payload.mediaFiles || []
            }
        };
    case 'REQUESTING_MEDIA_FAILED':
        return { ...state,
            ...{
                isRequesting: false,
                isRequestingFailed: true,
                items: []
            }
        };
    default:
        return state;
  }
}
