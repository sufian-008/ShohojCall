import React from 'react'
import { Link } from 'react-router-dom'
import "../App.css"
export default function LandingPage() {
  return (
    <div className='landingPageContainer'>
         <nav>
          <div className='navHeader'>
              <h2>ShohojCall</h2>
          </div>
          <div className='navlist'>
             <p>Join as  Guest</p>
             <p>Register</p>
              <div role='button'>
                     <p>Login</p>
              </div>
          </div>
         </nav>

         <div className="landingMainContainer">
             <div>
              <h1><span style={{color:"#b16e0ff0"}}>Connect</span> Your Love Ones</h1>
              <p>Cover a distance by ShohojCall</p>
              <div role='button'>
                <Link to="/auth">Get Startet</Link>
              </div>
             </div>
             <div>
              <img src="https://techwiser.com/wp-content/uploads/2018/10/Make-Video-Calls-From-Android-to-iOS-3.png" alt="" />
             </div>
         </div>
    </div>
  )
}
