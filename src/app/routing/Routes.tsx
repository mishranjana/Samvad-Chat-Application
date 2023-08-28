import React, { FC } from 'react';
import { Redirect, Switch, Route, BrowserRouter } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { MasterLayout } from '../../_metronic/layout/MasterLayout';
import { PrivateRoutes } from './PrivateRoutes';
import { Logout, AuthPage } from '../modules/auth';
import { ErrorsPage } from '../modules/errors/ErrorsPage';
import { RootState } from '../../setup';
import Login from '../../Chat_App/login/Login';
import Dashboard from '../../Chat_App/dashboard/Dashboard';
import Register from '../../Chat_App/register/Register';
import AuthProvider from '../../Chat_App/auth';
import ForgotPass from '../../Chat_App/login/ForgotPass';
import Profile from '../../Chat_App/profile/Profile';
import { toAbsoluteUrl } from '../../_metronic/helpers';

const Routes: FC = () => {
  return (
    <BrowserRouter>
      <div
        className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
        style={{
          backgroundImage: `url(${toAbsoluteUrl(
            '/media/illustrations/sketchy-1/14.png'
          )})`,
        }}
      >
        
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/forgot-password' component={ForgotPass} />
            <Route path='/profile' component={Profile} />
            <Route path='/error' component={ErrorsPage} />
            <Redirect to='/login' />
          </Switch>
        
      </div>
    </BrowserRouter>
  );
};

export { Routes };
