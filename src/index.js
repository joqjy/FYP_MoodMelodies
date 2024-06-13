import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login.js';
import Work from './pages/Work.js';
import AccountCreation from './pages/CreateAccount.js';
import Welcome from './pages/Welcome.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <BrowserRouter>
      <Routes>
        <Route path='/Login' element={<Login />}></Route>
        <Route path='/CreateAccount' element={<AccountCreation />}></Route>
        <Route path='/Work' element={<Work />}></Route>
        <Route path='/Welcome/*' element={<Welcome />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
