import React from 'react';
import {Col_Login} from './Col_Login.jsx';

export const College_Login = () => {
  return (
    <div className="flex h-screen">
      <div className="w-3/5">
        <img src="back_login.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="w-2/5 flex justify-center items-center">
        <Col_Login />
      </div>
    </div>
  );
};


