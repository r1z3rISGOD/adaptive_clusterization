import React from "react"
import {xlsParser} from "../../../utils/xlsParser";
import './LoadFileBtn.css'

export const LoadFileBtn = () => {
    const handleFileUpload = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        xlsParser(file).then(resp => console.log(resp));
    }
    return(
        <>
            <button className='load_file_btn' onClick={() => document.getElementById('getFile').click()}>Upload new file</button>
            <input id='getFile' className='load_file_input' type="file" accept=".xls,.xlsx"
               onChange={event => handleFileUpload(event)}
            />
        </>
    )
}
