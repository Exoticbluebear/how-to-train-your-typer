import React from "react";
import "./Darkmode.css";

const Darkmode = () => {
    const setDarkMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'dark')
    }

    const setLightMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'light')
    }

    const toggleTheme = (e) => {
        if (e.target.checked) setDarkMode();
        else setLightMode();
    };

    return (

        <div className="darkmode-toggle">
            <label class="switch">
            <input 
            type='checkbox'
            onChange={toggleTheme}/>   
            <span className="slider round"></span>     
            </label>   
            <div className="heading">
                <h4>How-To-Train-Your-Typer</h4>
            </div>
            <div className="title">
                <h4>An app by Kushan Amugoda</h4>
            </div>    
        </div>
    )
};

export default Darkmode;
