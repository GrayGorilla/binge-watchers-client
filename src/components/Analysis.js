import React from 'react';
import { SERVER_PORT, SERVER_IP, ButtonID } from '../globals';
import './Analysis.css';
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"

var analytics = 0;

class Analysis extends React.Component {
  //var analytics = "0";

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      selection: null,
      entries: [],
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
    console.log(value);
    analytics=value;
    this.setState({
      ...this.state,
      selection: value,
    });
    console.log(analytics);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      error,
      isLoaded,
      textFields,
      selection
    } = this.state;

    // Selection changed
    if(selection && selection !== prevState.selection) {
      this.setState({
        ...this.state,
        isLoaded: false
      });
      // Create Query
      const params = {
        "category_id": textFields.category,
        "channel_title": textFields.channel
      };
      // Generate parameters string
      const esc = encodeURIComponent;
      let queryList = [];

      for (let key in params) {
        if(params[key]) {
          queryList.push(esc(key) + '=' + esc(params[key]))
        }
      }
      const query = queryList.join('&');
      // Hard coded fetch to server ip
      console.log('Stuff::', `http://${SERVER_IP}:${SERVER_PORT}/test`)
      fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`)
      .then(res => res.json())
      .then(
        (result) => {
          console.log('JSON response: ', result);
          for (let i = 0; i < result.results.length; i++) {
            result.results[i].unshift(result.resultsIndex[i]);
          }
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            selection: prevState.selection,
            entries: [],
            textFields: {
              category: null,
              channel: null
            }
          });
        },
        (error) => {
          this.setState({
            ...this.state,
            error,
            isLoaded: true,
            selection: prevState.selection,
            entries: [],
            textFields: {
              category: null,
              channel: null,
            }
          });
        }
      )
    }
  }

  render_data(selected) {
    console.log('Creating graphic')
    switch(analytics) {
      case 1:
        return(
          <Button>
            Buzzword
          </Button>
        )

      case 2:
        return(
          <Button>
            Tags
          </Button>
        )

      case 3:
        return(
          <Button>
            Day of the Week
          </Button>
        )

      case 4:
        return(
          <Button>
            Category
          </Button>
        )

      default:
        return(
          <div>
            Here 
          </div>
        )

  }
}

  render() {
    const{error, isLoaded, entries, selection} = this.state;
    console.log('Rendering...');
    if(error) {
      return(
        <div className='Analysis-header'>
          <header className = 'Analysis-header'>
            <h3>
              Error: {error.message}
            </h3>
          </header>
        </div>
      )
    }
    else if(!isLoaded) {
      return(
        <div className='Analysis-header'>
          <header className = 'Analysis-header'>
            <h3>
              Loading...
            </h3>
          </header>
        </div>
      )
    }
    else {
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
              value=''
              onChange={event => this.handleSelectChange(event)}
            >
            <MenuItem value={1}>Buzzwords</MenuItem>
            <MenuItem value={2}>Tags</MenuItem>
            <MenuItem value={3}>Day of the Week</MenuItem>
            <MenuItem value={4}>Category</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          {this.render_data(this.selection)}
        </div>
      </div>
    )
  }
  }
};

export default Analysis;
