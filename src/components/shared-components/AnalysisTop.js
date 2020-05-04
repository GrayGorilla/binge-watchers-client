import React from 'react';
import TextField from "@material-ui/core/TextField"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"

function AnalysisTop(props) {
  return (
    <div>
      <h1>
        Analysis Page
      </h1> 
      <div>
        <TextField
          id="category"
          label = "Category"
          style = {{marginRight:10}}
          onChange={event => props.handleInputChange(event)}
        />
        <TextField
          id="channel"
          label="Channel"
          style = {{marginRight:10}}
          onChange={event => props.handleInputChange(event)}
        />
      </div>
      <div>
        <FormControl style={{minWidth:150}}>
          <InputLabel id="analysis">Analysis</InputLabel>
          <Select
            labelId="analysis"
            id="analysis"
            autoWidth
            value=''
            onChange={event => props.handleSelectChange(event)}
          >
          <MenuItem value={1}>Buzzwords</MenuItem>
          <MenuItem value={2}>Tags</MenuItem>
          <MenuItem value={3}>Day of the Week</MenuItem>
          <MenuItem value={4}>Category</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default AnalysisTop;
