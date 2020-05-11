import React from 'react';
import TextField from "@material-ui/core/TextField"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import { ButtonID, LOCATION } from '../../globals';

function AnalysisTop(props) {
  // Disable load button unless a location has been selected
  const loadDisabled = props.locationSelection ? false : true;
  return (
    <div>
      <h1>
        Analysis Page
      </h1> 
      <div>
        <TextField
          id="category"
          label = "Category"
          style = {{marginRight:30}}
          onChange={event => props.handleInputChange(event)}
        />
        <TextField
          id="channel"
          label="Channel"
          onChange={event => props.handleInputChange(event)}
        />
      </div>
      <div>
        <FormControl style={{minWidth:150, marginRight:30}}>
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
        <FormControl style={{minWidth:150}}>
          <InputLabel id="location">Location</InputLabel>
          <Select
            labelId="location"
            id="location"
            autoWidth
            value=''
            onChange={event => props.handleFileChange(event)}
          >
          <MenuItem value={1}>US</MenuItem>
          <MenuItem value={2}>CA</MenuItem>
          <MenuItem value={3}>DE</MenuItem>
          <MenuItem value={4}>FR</MenuItem>
          <MenuItem value={5}>GB</MenuItem>
          <MenuItem value={6}>IN</MenuItem>
          <MenuItem value={7}>JP</MenuItem>
          <MenuItem value={8}>KR</MenuItem>
          <MenuItem value={9}>MX</MenuItem>
          <MenuItem value={10}>RU</MenuItem>
          <MenuItem value={11}>Load Custom File</MenuItem>
          </Select>
          <FormHelperText>Selected: {LOCATION[props.locationSelection]}</FormHelperText>
        </FormControl>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{marginRight:30, marginTop:10}}
          onClick={() => props.handleClick(ButtonID.analysis)}
        >
          GET ANALYSIS
        </Button>
        <Button
          variant="contained"
          color="default"
          disabled={loadDisabled}
          style={{marginTop:10}}
          onClick={() => props.handleClick(ButtonID.load)}
        >
          LOAD DATA
        </Button>
      </div>
    </div>
  );
}

export default AnalysisTop;
