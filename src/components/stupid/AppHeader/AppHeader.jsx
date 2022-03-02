import './header.css'
import React from "react";
import {LoadFileBtn} from "../LoadFileBtn";

export const AppHeader = () => {
    return(
        <div className='app_header'>
            <LoadFileBtn/>
        </div>
    );
}
