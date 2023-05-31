import styled from "./RecordNotFound.module.css"

const RecordNotFound = () => {
    return (
        <div className={styled.notfound}>
            <h2 className={styled.notfoundtext}>RECORDS NOT FOUND</h2>
        </div>
    )
}

export default RecordNotFound