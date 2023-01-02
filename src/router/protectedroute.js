
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
        function isAuth() {
                if (!localStorage.getItem('refresh_token') ) {
                  return true;
                }
                return false;
              }
              
        return isAuth() ? <Navigate to="/" />  :<Outlet /> ;
}

export default PrivateRoute;
