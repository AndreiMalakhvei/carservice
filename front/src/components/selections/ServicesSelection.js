import styled from "./Selection.module.css"
import {useEffect, useState} from "react";
import axios from "axios";

const ServicesSelection= (props) => {

    const [services, setServices] = useState()

    useEffect( () =>{
       axios
        .get('http://127.0.0.1:8000/api/services/')
        .then(response => {setServices(response.data)
        props.transmitter(response.data)}
        )
    }, []);

    return (

    <div className={styled.selectionwrapper}>
        {services &&
            <div>
            <label className={styled.selectionlabel}>SELECT SERVICE</label>
            <select name="service" id="selectedservice" className="formselect" onChange={props.selected}>
        {services.map(
            service =>
            <option key={service.id} value={service.id}>{service.work}</option>
            )}
            </select>
            </div> }

    </div>

    )
}

export default ServicesSelection

