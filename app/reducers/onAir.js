// @flow
const initialState = {
    now: {}
};

export default function onAir(state = initialState, action) {
  switch (action.type) {
    case 'CURRENT_MEDIA':
        return { now: action.payload };
    default:
        return state;
  }
}
