import {useState, useEffect, useRef} from "react";
import axios from "axios";
import TableDisplay from "../../components/tables/TableDisplay";
import CitiesSelection from "../../components/selections/CitiesSelection";
import RecordNotFound from "../../errorhandlers/RecordNotFound";

const Query3= () => {
    const [tableData, setTableData] = useState([])
    const [cityValue, setCityValue] = useState()
    const [notFound, setNotFound] = useState(false)

    const handleSelect = (event) => {
        setCityValue(event.target.value)
        }

    useEffect(() => {
        if (cityValue) {
            axios
                .get('http://127.0.0.1:8000/api/task3/', {params: {city: cityValue}})
                .then(response => {
                    setTableData(response.data)
                    setNotFound(false)
                })
                .catch(function (error) {
                    setNotFound(true)
                })
        }
    }, [cityValue]);


   return (<div>

              <CitiesSelection  selected={handleSelect}/>

       {notFound ? <RecordNotFound />: null}

       {!notFound && tableData.bills_over_avg  &&
           <div>
               <div><h>Average in {cityValue}: {tableData.average_in_city}</h></div>
         <TableDisplay datas={tableData.bills_over_avg}
            headers={Object.keys(tableData.bills_over_avg[0])} />
               </div>
        }
    </div>);
}

export default Query3