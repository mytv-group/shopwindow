// @flow
const initialState = {
    pending: null,
    pointId: null,
    serverUrl: null,
    interactionUrl: null,
    authToken: null,
    notificationEmail: null
};

export default function settings(state = initialState, action) {
  switch (action.type) {
    case 'STORING_SETTINGS_START':
        return { ...state, ...{ pending: true } };
    case 'STORING_SETTINGS_COMPLETE':
        return { ...settings, ...{
            pending: false,
            pointId: parseInt(action.payload.pointId),
            serverUrl: action.payload.serverUrl,
            interactionUrl: action.payload.interactionUrl,
            authToken: action.payload.authToken,
            notificationEmail: action.payload.notificationEmail
        }};
    case 'STORING_SETTINGS_FAILED':
        return state;
    case 'READING_SETTINGS_START':
        return { ...state, ...{ pending: true } };
    case 'READING_SETTINGS_COMPLETE':
        return { ...settings, ...{
            pending: false,
            pointId: parseInt(action.payload.pointId),
            serverUrl: action.payload.serverUrl,
            interactionUrl: action.payload.interactionUrl,
            authToken: action.payload.authToken,
            notificationEmail: action.payload.notificationEmail
        }};
    case 'READING_SETTINGS_FAILED':
        return state;
    default:
        return state;
  }
}
