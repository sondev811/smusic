const initialState = {
  isTyping: false
};
const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TYPING':
      return {
        ...state,
        isTyping: action.payload
      };
    default:
      return state;
  }
};
export default searchReducer;
