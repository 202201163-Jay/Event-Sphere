import React from 'react'
// import './style.css'

function Card({role}) {

  // Determine the href based on the role
  const loginHref = role === "college" ? "/college-login" : "/login";
  const registerHref = role === "college" ? "/college-register" : "/register";

  return (
    <>
        <div className="role-choice">

            <p id="heading">For {role}</p>
            <p id="explaination">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Cumque doloremque reprehenderit numquam voluptates, consequatur 
                suscipit quaerat recusandae nisi amet maxime maiores omnis 
                consectetur minus deleniti architecto distinctio blanditiis at 
                possimus sunt voluptatem eius perspiciatis quos inventore quae. 
                Officia, accusamus odit!</p>

                <a href={loginHref}><button>Log In</button></a>

                <h3>Don't have an account? <a href={registerHref}>Sign Up</a></h3>
        </div>
    </>
  )
}

export default Card