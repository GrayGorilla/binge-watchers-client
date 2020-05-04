import React from 'react';
import { SERVER_PORT, SERVER_IP } from '../globals';
import './Analysis.css';
import AnalysisTop from './AnalysisTop';
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
      buzzwords: [],
      trendingDays: {},
      topCategories: {},
      textFields: {
        category: null,
        channel: null
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.selectDayOfWeek = this.selectDayOfWeek.bind(this);
    this.selectCategories = this.selectCategories.bind(this);
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
    this.setState({
      ...this.state,
      selection: value,
    });
    analytics = value;
    switch (value) {
      case 1:
        console.log('In handleSelectChange() - Buzzwords!');
      break;
      case 2:
        console.log('In handleSelectChange() - Tags!');
      break;
      case 3:
        console.log('In handleSelectChange() - Day of the Week!');
        this.selectDayOfWeek();
      break;
      case 4:
        console.log('In handleSelectChange() - Category!');
        this.selectCategories();
      break;
    }
  }

  selectDayOfWeek() {
    this.setState({
      ...this.state,
      isLoaded: false
    });
    const { textFields } = this.state;
    // Create Query
    const params = {
      "day_of_the_week": "true",
      "category_id": textFields.category,
      "channel_title": textFields.channel
    };
    // Generate parameters string
    const esc = encodeURIComponent;
    let queryList = [];

    for (let key in params) {
      if (params[key]) {
        queryList.push(esc(key) + '=' + esc(params[key]));
      }
    }
    const query = queryList.join('&');
    // Fetch from server
    fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`)
    .then(res => res.json())
    .then(
      result => {
        console.log('JSON dayOfWeek response: ', result);
        this.setState({
          ...this.state,
          error: null,
          isLoaded: true,
          trendingDays: result.day_of_the_week,
          textFields: {
            category: null,
            channel: null
          }
        });
        console.log('trendingDays: ', this.state.trendingDays);
      },
      error => {
        this.setState({
          ...this.state,
          error,
          isLoaded: true,
          trendingDays: {},
          textFields: {
            category: null,
            channel: null
          }
        });
      }
    )
  }

  selectCategories() {
    this.setState({
      ...this.state,
      isLoaded: false
    });
    // Create Query
    const esc = encodeURIComponent;
    const query = esc('categories_count') + '=' + esc('true');
    fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`)
    .then(res => res.json())
    .then(
      result => {
        console.log('JSON category response: ', result);
        this.setState({
          ...this.state,
          error: null,
          isLoaded: true,
          topCategories: result.category_count,
          textFields: {
            category: null,
            channel: null
          }
        });
        console.log('topCategories: ', this.state.topCategories);
      },
      error => {
        this.setState({
          ...this.state,
          error,
          isLoaded: true,
          topCategories: null,
          textFields: {
            category: null,
            channel: null
          }
        });
      }
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      textFields,
      selection
    } = this.state;

    console.log('selection', selection);

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
            data_analyze = result.buzzwords;
            this.setState({
              ...this.state,
              error: null,
              isLoaded: true,
              buzzwords: result.buzzwords,
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

  renderData(selected) {
    const { trendingDays, topCategories } = this.state;
    let display;
    console.log('Creating graphic')
    if (analytics) selected = analytics;

    switch(selected) {
      case 1:
        display = [];
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
        );

      case 2:
        display = [];
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
        );

      case 3:
        // Bar Graph: Top Days for Trending Videos
        display = [];
        for (let key in trendingDays) {
          display.push({
            weekDay: key,
            count: trendingDays[key]
          });
        }
        display.sort((x, y) => (y.count - x.count));
        console.log('Display: ', display);

        return(
          <Paper>
            <Chart data={display}>
              <ArgumentAxis />
              <ValueAxis max={7} />

              <BarSeries
                valueField="count"
                argumentField="weekDay"
              />
              <Title text="Top Days for Trending Videos" />
            </Chart>
          </Paper>
        );

      case 4:
        // Bar Graph: Top 10 Trending Categories
        display = [];
        for (let key in topCategories) {
          display.push({
            category: key,
            count: topCategories[key]
          });
        }
        display.sort((x, y) => (y.count - x.count));
        while (display.length > 10) {
          display.pop();
        }
        console.log('Display: ', display);

        return (
          <Paper>
            <Chart data={display}>
              <ArgumentAxis />
              <ValueAxis max={7} />

              <BarSeries
                valueField="count"
                argumentField="category"
              />
              <Title text="Top 10 Trending Categories" />
              <Animation />
            </Chart>
          </Paper>
        );

      default:
        return (
          <div>
            <h4>
              Please select a type of analysis.
            </h4>
          </div>
        );    
    }
  }

  render() {
    const { error, isLoaded, selection } = this.state;
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
            <AnalysisTop 
              selection
              handleInputChange={this.handleInputChange} 
              handleSelectChange={this.handleSelectChange}
            />
          </header>
          <div>
            <br />
            {this.renderData(selection)}
          </div>
        </div>
      );
    }
  }
};

export default Analysis;
