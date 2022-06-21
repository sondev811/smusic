import React from 'react';
import Login from './Login';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';

describe('With React Testing Library', () => {
  const initialState = {
    isLoading: false
  };
  const mockStore = configureStore();
  let store;

  it('Render login without crashing', () => {
    store = mockStore(initialState);
    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Login />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('input')).not.toBeNull();
  });
});
