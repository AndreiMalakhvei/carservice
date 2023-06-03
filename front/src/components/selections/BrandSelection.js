import styled from "./Selection.module.css"
import {useEffect, useState} from "react";
import axios from "axios";

const BrandSelection= (props) => {

    const [brands, setBrands] = useState()

    useEffect( () =>{
       axios
        .get('http://127.0.0.1:8000/api/brands/')
        .then(response => {setBrands(response.data)})
    }, []);

    return (

    <div className={styled.selectionwrapper}>
        {brands &&
            <div>
            <label className={styled.selectionlabel}>SELECT BRAND</label>
            <select name="brand" id="selectedbrand" className="formselect" onChange={props.selected}>
        {brands.map(
            brand =>
            <option key={brand.id} value={brand.id}> {brand.brandname}</option>
            )}
            </select>
            </div> }

    </div>

    )
}

export default BrandSelection