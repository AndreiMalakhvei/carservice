import {useState, useEffect} from "react";
import axios from "axios";
import TableDisplay from "../../components/tables/TableDisplay";

const Query4= () => {
    const [tableData, setTableData] = useState({})

    useEffect( () =>{
       axios
        .get('http://127.0.0.1:8000/api/task4/')
        .then(response => {setTableData(response.data)})
    }, []);

   return (<div>
        {tableData.length > 0 &&
            <TableDisplay datas={tableData}
            headers={Object.keys(tableData[0])} />
        }
    </div>);
}

export default Query4