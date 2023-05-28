import React from "react";
import styled from "./TableDisplay.module.css"

const TableDisplay= (props) => {
    return (
        <div>
        <table className={styled.tables}>

            <thead>
            <tr>
                <th scope="colId">id</th>
                <th scope="colTitle">firstname</th>
                <th scope="colType">lastname</th>
                <th scope="colDesc">cityname</th>
                <th scope="colPrice">avg_cust</th>
                <th scope="colSize">avg_citys</th>
            </tr>
            </thead>
            <tbody>
            {props.datas.map(record =>
                <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.firstname}</td>
                    <td>{record.lastname}</td>
                    <td>{record.cityname}</td>
                    <td>{record.avg_cust}</td>
                    <td>{record.avg_citys}</td>
                </tr>)}
            </tbody>
        </table>
            </div>
    )
}

export default TableDisplay
