const initialState = {
    volume: 0.5,
}
const playerReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_VOLUME':
            return {
                ...state, 
                volume: action.payload
            };
        default:
            return state;
    }
}
export default playerReducer;