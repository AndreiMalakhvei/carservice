import styled from "./CitiesSelection.module.css"

const citiesSelection= (props) => {
    return (
             <div className={styled.selectionwrapper}>
            <label className={styled.selectionlabel}>SELECT CITY</label>
            <select name="city"  className="formselect" onChange={props.selected}>
                {props.citiesarray.map(
                    city =>
                        <option key={city.id}  value={city.cityname}> {city.cityname}</option>
                )}
            </select>
        </div>
    )
}

export default citiesSelection