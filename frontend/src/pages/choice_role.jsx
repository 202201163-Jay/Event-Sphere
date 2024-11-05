import React from 'react'
import Card from './choice_common.jsx'
import './choice_role.css'


function Rolechoice() {
  return (
    <>
        <div className="main-body-choice">

            <div className="colleges-part">
                <Card role="College"/>
            </div>
            <div className="vr"></div>
            <div className="participants-part">
                <Card role="Participant"/>
            </div>

        </div>
    </>
  )
}

export default Rolechoice