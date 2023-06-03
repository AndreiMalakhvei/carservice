import {useState, useEffect, useRef} from "react";
import axios from "axios";
import BrandSelection from "../../components/selections/BrandSelection";
import styled from "./Creates.module.css"
import CustomerSelection from "../../components/selections/CustomerSelection";
import TableDisplay from "../../components/tables/TableDisplay";
import RecordNotFound from "../../errorhandlers/RecordNotFound";

const CreateCar = () => {
    const [customer, setCustomer] = useState()
    const [tableData, setTableData] = useState([])
    const [notFound, setNotFound] = useState(false)

    async function doGetRequest(id) {
    await axios
            .get('http://127.0.0.1:8000/api/cars/', {params: {customer: id}})
            .then(response => {setTableData(response.data)
                console.log(response.data)
            setNotFound(false)
            })
            .catch(function (error) {setNotFound(true)})
    }

    const handleForm= (event) => {
    event.preventDefault()

    axios
        .post('http://127.0.0.1:8000/api/addcar/', {
            vin: event.target.vin.value,
            regnumber: event.target.regnumber.value,
            carmodel: event.target.carmodel.value,
            owner: parseInt(customer),
            brand: parseInt(event.target.brand.value)
            })
        .then(response => {
            if (response.status === 201) {
            doGetRequest(customer)
            }
        })
        .catch(function (error) {
            console.log(error.toString())
        })
    }

   const customerChangeHandler = (event) => {
        event.preventDefault()
        setCustomer(event.target.value)
       doGetRequest(event.target.value)
    }

   return (<div>

       <CustomerSelection selected={customerChangeHandler} />

       <div><h5>Already registered vehicles of the customer:</h5></div>
       <div>
           {notFound ? <RecordNotFound />: null}
           { customer && !notFound && tableData.length > 0 &&
               <TableDisplay datas={tableData}
                              headers={Object.keys(tableData[0])}/>
           }
       </div>


            <form className={styled.formcontainer} onSubmit={handleForm}>
                <label htmlFor="vin" className={styled.inputlabel} >VIN</label>
                <input type="text" id="vin" className={styled.inputfield}/>
                <label htmlFor="regnumber" className={styled.inputlabel}>Lastname</label>
                <input type="text" id="regnumber" className={styled.inputfield}/>
                <label htmlFor="carmodel" className={styled.inputlabel}>Registration number</label>
                <input type="text" id="carmodel" className={styled.inputfield}/>
                <BrandSelection />
                <button type="submit">CREATE CAR</button>
            </form>
    </div>);
}

export default CreateCar