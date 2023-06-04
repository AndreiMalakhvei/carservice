import styled from "./Selection.module.css"
import {useEffect, useState} from "react";
import axios from "axios";

const ServicesSelection= (props) => {


    // console.log("carselect props lrnght=" + {props.datas.length})

    // useEffect( () =>{
    //    axios
    //     .get('http://127.0.0.1:8000/api/customers/')
    //     .then(response => {setServices(response.data)})
    // }, []);

    return (

    <div>
        {props.datas.length > 0 &&
            <div className={styled.selectionwrapper}>
            <label className={styled.selectionlabel}>SELECT CAR</label>
            <select name="car" id="selectedcar" className="formselect" onChange={props.selected}>
        {props.datas.map(
            car =>
            <option key={car.vin} value={car.vin}>{car.regnumber} {car.brandname} {car.carmodel}</option>
            )}
            </select>
            </div> }

    </div>

    )
}

export default ServicesSelection