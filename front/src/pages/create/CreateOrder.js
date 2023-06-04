import React, {useState} from "react";
import axios from "axios";
import styled from "./Creates.module.css"
import CustomerSelection from "../../components/selections/CustomerSelection";
import CarSelection from "../../components/selections/CarSelection";
import ServicesSelection from "../../components/selections/ServicesSelection";


const CreateOrder = () => {
    const [customer, setCustomer] = useState()
    const [carselect, setCarselect] = useState([])
    const [services, setServices] = useState([])
    const [serviceData, setServiceData] = useState([])
    const [totalSum, setTotalSum] = useState(0)



    async function chooseCars(id) {
    await axios
            .get('http://127.0.0.1:8000/api/cars/', {params: {customer: id}})
            .then(response => {setCarselect(response.data)
                // console.log(response.data)
            })
            .catch(function (error) {})
    }

    const handleForm= (event) => {
    event.preventDefault()

        let itemList = document.getElementById("selectedservice");
        let collection = itemList.selectedOptions;

        setServices([...services, {work: parseInt(event.target.selectedservice.value),
        quantity: parseInt(event.target.qty.value),
        workdesc: collection[0].label}])

        let tab = document.getElementById('tbodyid')


        if (tab) {
            let lgth =  tab.rows.length
            let arr = []
            for (let i = 0; i < lgth; i++) {
                arr.push(parseInt(tab.rows[i].cells[2].innerText))
            }
            const sum = arr.reduce((total, item) => total + item);
            setTotalSum(sum)
        }



    // axios
    //     .post('http://127.0.0.1:8000/api/addcar/', {
    //         vin: event.target.vin.value,
    //         regnumber: event.target.regnumber.value,
    //         carmodel: event.target.carmodel.value,
    //         owner: parseInt(customer),
    //         brand: parseInt(event.target.brand.value)
    //         })
    //     .then(response => {
    //         if (response.status === 201) {
    //         doGetRequest(customer)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error.toString())
    //     })
    }

   const customerChangeHandler = (event) => {
        event.preventDefault()
        setCustomer(event.target.value)
        chooseCars(event.target.value)
    }


     const dataGetter = (data) => {
     var object1 = data.reduce(
  (obj, item) => Object.assign(obj, { [item.id]: item }), {});
         setServiceData(object1)
    }

    // const columnCounter =  () => {
    //     var tab = document.getElementById('tbodyid')
    //
    //     console.log(tab);
    //     return 3;
    //
    // }


   return (
       <div>
           <form className={styled.formcontainer} onSubmit={handleForm}>
               <CustomerSelection selected={customerChangeHandler}/>

               <CarSelection datas={carselect}/>

               <ServicesSelection transmitter={dataGetter}/>

               <label htmlFor="gty" className={styled.inputlabel}>Quantity</label>
               <input type="number" id="qty" min='1' className={styled.inputfield}/>

               <button type="submit">CREATE ORDER</button>
           </form>

           {services.length > 0 &&
               <div>
                   <table id="tid">
                       <thead>
                       <tr>
                           <th>service item</th>
                           <th>quantity</th>
                           <th>price</th>
                       </tr>
                       </thead>
                       <tbody id='tbodyid'>
                       {services.map(service =>
                           <tr>
                               <td>{service.workdesc}</td>
                              <td>{service.quantity}</td>
                              <td>{(serviceData[service.work].price * service.quantity).toFixed(2)}</td>
                           </tr>)
                       }
                       </tbody>
                       <tfoot>
                            <tr>
                              <td>TOTAL:</td>
                              <td></td>
                                <td>{totalSum}</td>
                            </tr>
                          </tfoot>

                   </table>
               </div>
           }


       </div>);
}

export default CreateOrder