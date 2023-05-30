import {useState, useEffect, useRef} from "react";
import axios from "axios";
import TableDisplay from "../../components/tables/TableDisplay";
import CitiesSelection from "../../components/selections/CitiesSelection";

const Query1= () => {
    const [tableData, setTableData] = useState([])
    const [citiesList, setCitiesList] = useState([])
    // const [cityValue, setCityValue] = useState()
    // const [limitValue, setLimitValue] = useState()
    const cityValue = useRef()
    const limitValue = useRef()

    const handleSelect = (event) => {
        }

    const handleForm= (event) => {

    event.preventDefault()

      limitValue.current = event.target.limitvalue.value
      cityValue.current = event.target.selectedcity.value

        if (limitValue && cityValue) {
            axios
                .get('http://127.0.0.1:8000/api/task1/', {params: {city: cityValue.current, limit: limitValue.current}})
                .then(response => {
                    setTableData(response.data)

                })
        }
    }

    useEffect( () =>{
       axios
        .get('http://127.0.0.1:8000/api/cities/')
        .then(response => {setCitiesList(response.data)})
    }, []);



   return (<div>

            <form onSubmit={handleForm}>
                <label htmlFor="min" >Цена от: </label>
                <input type="number" id="limitvalue" />
                <CitiesSelection citiesarray={citiesList}  />
                <button type="submit">SEND REQUEST</button>
            </form>


       {tableData.length  &&
         <TableDisplay datas={tableData}
            headers={Object.keys(tableData[0])} />
        }
    </div>);
}

export default Query1