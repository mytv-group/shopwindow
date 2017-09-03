// @flow
const initialState = {
    pending: null,
    items: []
};

export default function widgets(state = initialState, action) {
  switch (action.type) {
    case 'GET_WIDGETS_PLAN_START':
        return { ...state, ...{ pending: true } };
    case 'GET_WIDGETS_PLAN_COMPLETE':
        return { ...state,
            ...{
                pending: false,
                items: action.payload.items || []
            }
        };
    case 'GET_WIDGETS_PLAN_FAILED':
        return { ...state,
            ...{
                pending: false,
                items: action.payload.items || []
            }
        };
    default:
        return state;
  }
}
