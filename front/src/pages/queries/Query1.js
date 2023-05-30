import {useState, useEffect} from "react";
import axios from "axios";
import TableDisplay from "../../components/tables/TableDisplay";
import CitiesSelection from "../../components/selections/CitiesSelection";

const Query1= () => {
    const [tableData, setTableData] = useState([])
    const [citiesList, setCitiesList] = useState([])
    const [cityValue, setCityValue] = useState()

    const handleSelect = (event) => {
        setCityValue(event.target.value)

        }

    useEffect( () =>{

       axios
        .get('http://127.0.0.1:8000/api/cities/')
        .then(response => {setCitiesList(response.data)})

    }, []);


    useEffect(() => {

        if (cityValue) {
            axios
                .get('http://127.0.0.1:8000/api/task3/', {params: {city: cityValue}})
                .then(response => {
                    setTableData(response.data)

                })
        }
    }, [cityValue]);




   return (<div>


        <CitiesSelection citiesarray={citiesList}  selected={handleSelect}/>

       {tableData.bills_over_avg  &&
           <div>
               <div><h>Average in {cityValue}: {tableData.average_in_city}</h></div>
         <TableDisplay datas={tableData.bills_over_avg}
            headers={Object.keys(tableData.bills_over_avg[0])} />
               </div>
        }
    </div>);
}

export default Query1