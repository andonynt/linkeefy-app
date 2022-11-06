import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  NotFound,
  Login,
  Dashboard,
  Signup,
  CreateUsername,
  User,
} from './routes/routesDispatcher';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/create-username' element={<CreateUsername />} />
      <Route path='/admin/' element={<Dashboard />} />
      <Route path='/user/:username' element={<User />} />
      <Route path='/*' element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
