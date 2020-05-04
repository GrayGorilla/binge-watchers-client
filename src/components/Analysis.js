import React from 'react';
import { SERVER_PORT, SERVER_IP, ButtonID } from '../globals';
import './Analysis.css';
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';

var analytics = 0;
var data_analyze;

class Analysis extends React.Component {

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
      entries,
      selection
    } = this.state;

    // Selection changed
    if(selection && selection !== prevState.selection) {
      this.setState({
        ...this.state,
        isLoaded: false
      });
      // Create Query
      if(analytics === 1) {
        const params = {
          "buzzwords": "true",
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
        fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`)
        .then(res => res.json())
        .then( 
          (result) => {
            console.log('JSON response: ', result);
            for (let i = 0; i < result.results.length; i++) {
              result.results[i].unshift(result.resultsIndex[i]);
            }
            data_analyze = result.buzzwords;
            this.setState({
              ...this.state,
              error: null,
              isLoaded: true,
              entries: result.buzzwords,
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
              textFields: {
                category: null,
                channel: null,
              }
            });
          }
        )
      }
      if(analytics === 2) {
        const params = {
          "individual_tags": "true",
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
        fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`)
        .then(res => res.json())
        .then( 
          (result) => {
            console.log('JSON response: ', result);
            for (let i = 0; i < result.results.length; i++) {
              result.results[i].unshift(result.resultsIndex[i]);
            }
            data_analyze = result.individual_tags;
            this.setState({
              ...this.state,
              error: null,
              isLoaded: true,
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
              textFields: {
                category: null,
                channel: null,
              }
            });
          }
        )
      }
    }
  }

  render_data(selected) {
    console.log('Creating graphic')    
    switch(analytics) {
      case 1:
        var display = [];
        for (let key in data_analyze) {
          if(!(key === "a" || key === "the" || key === "of" || key === "was" || key === "by" || key === "an")) {
            display.push({word:key, count:data_analyze[key]});
          }
        }
        display.sort(function(x,y) {
          return y.count - x.count;
        });
        while(display.length > 10) {
          display.pop();
        }
        console.log(display);
        return(
          <Paper>
            <Chart
             data={display}
            >
              <ArgumentAxis />
              <ValueAxis max={7} />

              <BarSeries
                valueField="count"
                argumentField="word"
              />
              <Title text="Buzzwords" />
              <Animation />
            </Chart>
          </Paper>
        )

      case 2:
        var display = [];
        for (let key in data_analyze) {
          if(!(key === "a" || key === "the" || key === "of" || key === "was" || key === "by" || key === "an")) {
            display.push({word:key, count:data_analyze[key]});
          }
        }
        display.sort(function(x,y) {
          return y.count - x.count;
        });
        while(display.length > 10) {
          display.pop();
        }
        console.log(display);
        return(
          <Paper>
            <Chart
             data={display}
            >
              <ArgumentAxis />
              <ValueAxis max={7} />

              <BarSeries
                valueField="count"
                argumentField="word"
              />
              <Title text="Tags" />
              <Animation />
            </Chart>
          </Paper>

        )

      case 3:
        return(
          <div>
            Day of the Week
          </div>
        )

      case 4:
        return(
          <div>
            Category
          </div>
        )

      default:
        

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
