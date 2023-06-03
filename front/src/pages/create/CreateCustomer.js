import {useState, useEffect, useRef} from "react";
import axios from "axios";
import CitiesSelection from "../../components/selections/CitiesSelection";
import styled from "./Creates.module.css"

const CreateCustomer = () => {
    const [citiesList, setCitiesList] = useState([])

    const handleForm= (event) => {
    event.preventDefault()

    axios
        .post('http://127.0.0.1:8000/api/addcustomer/', {
            firstname: event.target.firstname.value,
            lastname: event.target.lastname.value,
            passport: event.target.passport.value,
            city: parseInt(event.target.selectedcity.value)
            })
        .then(response => {
            console.log(response.status)
        })
        .catch(function (error) {
            console.log(error.toString())
        })
    }

    useEffect( () =>{
       axios
        .get('http://127.0.0.1:8000/api/cities/')
        .then(response => {setCitiesList(response.data)})
    }, []);



   return (<div>
            <form className={styled.formcontainer} onSubmit={handleForm}>
                <label htmlFor="firstname" className={styled.inputlabel} >Firstname</label>
                <input type="text" id="firstname" className={styled.inputfield}/>
                <label htmlFor="lastname" className={styled.inputlabel}>Lastname</label>
                <input type="text" id="lastname" className={styled.inputfield}/>
                <label htmlFor="passport" className={styled.inputlabel}>Passport</label>
                <input type="text" id="passport" className={styled.inputfield}/>
                <CitiesSelection citiesarray={citiesList}  />
                <button type="submit">CREATE CUSTOMER</button>
            </form>
    </div>);
}

export default CreateCustomer