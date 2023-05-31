import {useState, useEffect, useRef} from "react";
import axios from "axios";
import TableDisplay from "../../components/tables/TableDisplay";
import CitiesSelection from "../../components/selections/CitiesSelection";
import RecordNotFound from "../../errorhandlers/RecordNotFound";

const Query1= () => {
    const [tableData, setTableData] = useState([])
    const [citiesList, setCitiesList] = useState([])
    const cityValue = useRef()
    const limitValue = useRef()

    const [notFound, setNotFound] = useState(false)

    const handleForm= (event) => {

    event.preventDefault()

      limitValue.current = event.target.limitvalue.value
      cityValue.current = event.target.selectedcity.value

        if (limitValue && cityValue) {
            axios
                .get('http://127.0.0.1:8000/api/task1/', {params: {city: cityValue.current, limit: limitValue.current}})
                .then(response => {
                    setTableData(response.data)
                    setNotFound(false)
                })
                .catch(function (error) {
                    setNotFound(true)
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
                <label htmlFor="limitvalue" >Цена от: </label>
                <input type="number" id="limitvalue" />
                <CitiesSelection citiesarray={citiesList}  />
                <button type="submit">SEND REQUEST</button>
            </form>

       {notFound ? <RecordNotFound />: null}


       {!notFound && tableData.length > 0 &&
         <TableDisplay datas={tableData}
            headers={Object.keys(tableData[0])} />
        }
    </div>);
}

export default Query1