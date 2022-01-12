const initialState = {
  isLoading: false,
  content: ''
};
const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
        content: action.payload.content
      };
    default:
      return state;
  }
};
export default loadingReducer;
