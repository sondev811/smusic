import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/auth.service';

const PrivateRoute = () => {
  const auth = authService.isAuthenticated();
  return auth ? (
    <Layout>
      {' '}
      <Outlet />{' '}
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
