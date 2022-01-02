const initialState = {
    isOpenPlayer: false,
}
const playerReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PLAYER':
            return {
                ...state, 
                isOpenPlayer: action.payload
            };
        default:
            return state;
    }
}
export default playerReducer;