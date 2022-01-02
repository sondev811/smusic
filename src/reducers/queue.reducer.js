const initialState = {
    queueList: [],
    currentMusic: {}
}
const queueReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'QUEUE':
            return {
                ...state,
                queueList: action.payload.queueList,
                currentMusic: action.payload.currentMusic
            };
        case 'QUEUE_ITEM': 
            return {
                ...state,
                queueList: action.payload
            }
        case 'CURRENT_MUSIC': 
            return {
                ...state,
                currentMusic: action.payload
            }
        default:
            return state;
    }
}
export default queueReducer;