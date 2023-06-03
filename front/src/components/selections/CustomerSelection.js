import styled from "./Selection.module.css"
import {useEffect, useState} from "react";
import axios from "axios";

const CustomerSelection= (props) => {

    const [customers, setCustomers] = useState()

    useEffect( () =>{
       axios
        .get('http://127.0.0.1:8000/api/customers/')
        .then(response => {setCustomers(response.data)})
    }, []);

    return (

    <div className={styled.selectionwrapper}>
        {customers &&
            <div>
            <label className={styled.selectionlabel}>SELECT CUSTOMER</label>
            <select name="customer" id="selectedcustomer" className="formselect" onChange={props.selected}>
        {customers.map(
            customer =>
            <option key={customer.id} value={customer.id}>{customer.firstname} {customer.lastname}</option>
            )}
            </select>
            </div> }

    </div>

    )
}

export default CustomerSelection