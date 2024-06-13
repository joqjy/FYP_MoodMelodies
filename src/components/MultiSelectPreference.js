import React from "react";
import { Button, FormControl, InputLabel, Select, MenuItem} from '@mui/material';

export default function MultiSelect(props) {
    const { title, selectionList, value, setValue } = props;

    var menuItems = []
    for(let i=0; i<selectionList.length; i++){
        menuItems.push(<MenuItem value={selectionList[i]}>{selectionList[i]}</MenuItem>)
    }

    return (
        <div>
            <p>{title}</p>
            <FormControl sx={{ m: 1, minWidth: 200, maxWidth: 200 }}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    onChange={e => {setValue(e.target.value)}}
                >
                    {menuItems}
                </Select>
            </FormControl>
        </div>
    )
}