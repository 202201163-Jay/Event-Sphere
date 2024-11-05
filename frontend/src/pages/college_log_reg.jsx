import React from 'react'
import './college_log_reg.css'

const Login = () => {
    const handler=(el)=>{
        let container=document.querySelector("#container");
        let login=document.querySelector("#login");
        let register=document.querySelector("#register");
        
        register.addEventListener("click",()=>{
            container.classList.add("active");
        });

        login.addEventListener("click",()=>{
            container.classList.remove("active");
        })
    }
  return (
    <div>
      <div id="container">
            <div className="container-form sign-up">
                <form className="forms">
                    <h1 className="heading">Register College</h1>
                    <input  type="text" className="inputs" id="college-name" placeholder="College Name"/>
                    <input  type="text" className="inputs" id="domain" placeholder="College Domain"/>
                    <input  type="text" className="inputs" id="email" placeholder="College Email Id"/>
                    <input  type="password" className="inputs" id="password" placeholder="Password"/>
                    <button className="sign-btn" id="up">SIGN UP</button>
                </form>
            </div>

            <div className="container-form sign-in">
                <form className="forms">
                    <h1 className="heading">Sign In</h1>
                    <input  type="text" className="inputs" id="email" placeholder="College Email Id"/>
                    <input  type="password" className="inputs" id="password" placeholder="Password"/>
                    <a href="#" id="forget-passwd">forgot password?</a>
                    <button className="sign-btn" id="in">LOG IN</button>
                </form>
            </div>
            
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Already Registered!</h1>
                        <p>Log In Using Your College Details</p>
                        <button className="hide" id="login" onClick={handler}>LOG IN</button>
                    </div>

                    <div className="toggle-panel toggle-right">
                        <h1>Thank You for Visiting Us!</h1>
                        <p>Register Your College to use features of our site</p>
                        <button className="hide" id="register" onClick={handler}>SIGN UP</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
