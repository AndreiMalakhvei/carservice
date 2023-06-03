import styled from "./Selection.module.css"
import {useEffect, useState} from "react";
import axios from "axios";

const CitiesSelection= (props) => {
    const [citiesList, setCitiesList] = useState([])

    useEffect( () =>{
       axios
        .get('http://127.0.0.1:8000/api/cities/')
        .then(response => {setCitiesList(response.data)})
    }, []);


    return (
             <div className={styled.selectionwrapper}>
            <label className={styled.selectionlabel}>SELECT CITY</label>
            <select name="city"  id="selectedcity" className="formselect" onChange={props.selected}>
                {citiesList.map(
                    city =>
                        <option key={city.id}  value={city.id}> {city.cityname}</option>
                )}
            </select>
        </div>
    )
}

export default CitiesSelection