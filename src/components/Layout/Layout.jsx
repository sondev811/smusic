import React from 'react';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Player from '../Player/Player';
import './Layout.scss';
import User from '../User/User';
import Loading from '../Loading/Loading';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
function Layout({ children }) {
  return (
    <div className="layout-container">
      <ToastContainer />
      <User />
      <Header />
      <div className="main-container">{children}</div>
      <Player />
      <Footer />
      <Loading />
    </div>
  );
}

export default Layout;
