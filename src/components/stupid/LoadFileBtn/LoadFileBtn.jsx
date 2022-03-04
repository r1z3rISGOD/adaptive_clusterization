import React from "react"
import {xlsParser} from "../../../utils/xlsParser";
import './LoadFileBtn.css'
import {cMeans, ierarchical, kMeans} from "../../../core/methods";

export const LoadFileBtn = () => {
    const handleFileUpload = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        xlsParser(file).then(resp => {
            const sheets = Object.keys(resp);
            const results = []
            resp[sheets[0]].forEach(line => {
                const values = Object.values(line).map(str => +str);
                values.splice(0, 1)
                results.push(values)
            })
            console.log(cMeans(3, results, 0.3, 2))
            console.log(kMeans(3, results))
        });
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
