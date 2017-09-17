// @flow
const initialState = {
    now: {},
    prev: {}
};

export default function onAir(state = initialState, action) {
  switch (action.type) {
    case 'CURRENT_MEDIA':
        return {
            now: action.payload,
            prev: state.now || {}
        };
    default:
        return state;
  }
}
