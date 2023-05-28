import {useState, useEffect} from "react";
import axios from "axios";
import TableDisplay from "../../components/tables/TableDisplay";

const Query1= () => {
    const [tableData, setTableData] = useState([])

    useEffect( () =>{
       axios
        .get('http://127.0.0.1:8000/api/task4/')
        .then(response => {setTableData(response.data)})
    }, []);


    console.log(tableData)
    console.log(Object.values(tableData))


    return (<div>
           <TableDisplay datas={tableData} />
    </div>);
}

export default Query1