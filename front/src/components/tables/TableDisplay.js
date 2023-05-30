import React from "react";
import styled from "./TableDisplay.module.css"

const TableDisplay= (props) => {
console.log("displaying table")
    console.log(props.datas)
    return (
        <div className={styled.tablewrapper}>
            <div>
        <table className={styled.tables}>

            <thead className={styled.tableheader}>
            <tr className={styled.tablerow}>
                {props.headers.map(header=>
                    <th className={styled.tableheadercell} scope={header}>{header}</th>
                )}
            </tr>
            </thead>
            <tbody className={styled.tablebody}>
            {props.datas.map(record =>
                <tr key={record.id}>
                    {Object.values(record).map(val =>
                        <td className={styled.tablecell}>{val}</td>
                    )}
                </tr>)
        }
            </tbody>
        </table>
            </div>
            </div>
    )
}

export default TableDisplay
