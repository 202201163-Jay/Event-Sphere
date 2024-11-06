import React from 'react';
import { Stu_Reg } from './Stu_Reg_Part';

export const Student_Register = () => {
  return (
    <div className="flex h-screen">
      <div className="w-3/5">
        <img src="back_login.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="w-2/5 flex justify-center items-center">
        <Stu_Reg />
      </div>
    </div>
  );
};
