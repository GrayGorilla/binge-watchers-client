import React from 'react';
import { SERVER_PORT, SERVER_IP, ButtonID } from '../globals';
import './Analysis.css';
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"

class Analysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      selection: null,
      textFields: {
        category: null,
        channel: null
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      isLoaded:true
    });
  }

  handleInputChange(event) {
    const id = event.target.id;
    const value = event.target.value;
    console.log('Latest input: ' + value);
    this.setState({
      ...this.state,
      textFields: {
        ...this.state.textFields,
        [id]: value
      }
    });
  }

  handleSelectChange(type) {
    const value = type.target.value;
    console.log(type.target.value);
    this.setState({
      ...this.state,
      selection: value,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      error,
      isLoaded,
      textFields,
      selection
    } = this.state;
  }

  render() {
    return (
      <div className='Analysis'>
        <header className='Analysis-header'>
          <h1>
            Analysis Page
          </h1> 
        </header>
        <div>
          <TextField
            id="category"
            label = "Category"
            style = {{marginRight:10}}
            onChange={event => this.handleInputChange(event)}
          />
          <TextField
            id="channel"
            label="Channel"
            style = {{marginRight:10}}
            onChange={event => this.handleInputChange(event)}
          />
        </div>
        <div>
          <FormControl style={{minWidth:150}}>
            <InputLabel id="analysis">Analysis</InputLabel>
            <Select
              labelId="analysis"
              id="analysis"
              autoWidth
              //value="selection"
              onChange={event => this.handleSelectChange(event)}
            >
            <MenuItem value={1}>Buzzwords</MenuItem>
            <MenuItem value={2}>Tags</MenuItem>
            <MenuItem value={3}>Day of the Week</MenuItem>
            <MenuItem value={4}>Category</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    )
  }
};

export default Analysis;
