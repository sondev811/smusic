import React, { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Loading from '../components/Loading/Loading';
import { authService } from '../services/auth.service';

const PrivateRoute = () => {
  const auth = authService.isAuthenticated();
  return auth ? (
    <Suspense fallback={null}>
      <Layout>
        {' '}
        <Outlet />{' '}
      </Layout>
    </Suspense>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
