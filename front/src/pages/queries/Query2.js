import {useState, useEffect, useRef} from "react";
import axios from "axios";
import TableDisplay from "../../components/tables/TableDisplay";
import RecordNotFound from "../../errorhandlers/RecordNotFound";


const Query2= () => {
    const [tableData, setTableData] = useState([])
    const startValue = useRef()
    const finValue = useRef()
    const [notFound, setNotFound] = useState(false)

    const handleForm= (event) => {
    event.preventDefault()

      startValue.current = event.target.vstart.value
      finValue.current = event.target.vfinish.value

        if (startValue && finValue) {
            axios
                .get('http://127.0.0.1:8000/api/task2/', {params: {start: startValue.current, fin: finValue.current}})
                .then(response => {
                    setTableData(response.data)
                    setNotFound(false)
                })
                .catch(function (error) {
                    setNotFound(true)
                })
        }
    }

   return (<div>
            <form onSubmit={handleForm}>
                <label htmlFor="start" >Start date</label>
                <input type="date" className="dateinput" id="vstart" name="vstart"
                               // value={currentDate}
                               min="2000-01-01" max="2040-01-01" />

                <label htmlFor="finish" >End date</label>
                <input type="date" id="vfinish" name="vfinish"
                               // value={currentDate}
                               min="2000-01-01" max="2040-01-01" />
                <button type="submit">SEND REQUEST</button>
            </form>

       {notFound ? <RecordNotFound />: null}

       {!notFound && tableData.length > 0  &&
         <TableDisplay datas={tableData}
            headers={Object.keys(tableData[0])} />

        }
    </div>);
}

export default Query2