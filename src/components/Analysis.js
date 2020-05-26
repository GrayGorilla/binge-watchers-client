import React from 'react';
import { SERVER_PORT, SERVER_IP } from '../globals';
import './Analysis.css';
import AnalysisTop from './shared-components/AnalysisTop';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  ScatterSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import NavBar from '../components/shared-components/NavBar';
import { ButtonID, LOCATION } from '../globals';

class Analysis extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      analysisSelection: 0,
      locationSelection: 0,
      buzzwords: [],
      buzz: {},
      tag: {},
      trendingDays: {},
      topCategories: {},
      dates: {},
      comments: {},
      globalVideos: {},
      textFields: {
        category: null,
        channel: null
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.loadData = this.loadData.bind(this);
    this.selectBuzzword = this.selectBuzzword.bind(this);
    this.selectTag = this.selectTag.bind(this);
    this.selectDayOfWeek = this.selectDayOfWeek.bind(this);
    this.selectCategories = this.selectCategories.bind(this);
    this.selectDate = this.selectDate.bind(this);
    this.selectComment = this.selectComment.bind(this);
    this.selectGlobalVideos = this.selectGlobalVideos.bind(this);
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
      analysisSelection: value,
    });
  }

  handleFileChange(event) {
    const { value } = event.target;
    this.setState({
      ...this.state,
      locationSelection: value
    });
  }

  handleClick(button) {
    const { analysisSelection } = this.state;
    switch (button) {
      // Get Analysis
      case ButtonID.analysis:
        switch (analysisSelection) {
          case 1:
            console.log('In handleClick() - Buzzwords!');
            this.selectBuzzword();
            break;
          case 2:
            console.log('In handleClick() - Tags!');
            this.selectTag();
            break;
          case 3:
            console.log('In handleClick() - Day of the Week!');
            this.selectDayOfWeek();
            break;
          case 4:
            console.log('In handleClick() - Category!');
            this.selectCategories();
            break;
          case 5:
            console.log('In handleClick() - Date!');
            this.selectDate();
            break;
          case 6:
            console.log('In handleClick() - Comments!');
            this.selectComment();
            break;
          case 7:
            console.log('In handleClick() - Global Videos!');
            this.selectGlobalVideos();
            break;
          default:
            alert('Please select analysis from dropdown.');
            break;
        }
        break;
      // Load Data
      case ButtonID.load:
        this.loadData();
        break;
      default:
        alert('Unknown button clicked');
        break;
    }
  }

  loadData() {
    this.setState({
      ...this.state,
      isLoaded: false
    });
    const { locationSelection } = this.state;
    // Custom
    if (locationSelection === 11) {
      alert('Not implemented yet');
      this.setState({
        ...this.state,
        isLoaded: true,
      });
      return;
    }
    let fileName = LOCATION[locationSelection] + 'videos'
    
    const esc = encodeURIComponent;
    const query = esc('filename') + '=' + esc(fileName);
    const requestOptions = { method: 'GET' };
    fetch(`http://${SERVER_IP}:${SERVER_PORT}/backup?${query}`, requestOptions)
    .then(res => res.json())
    .then(
      results => {
        console.log("Status: ", results.status);
        this.setState({
          ...this.state,
          error: null,
          isLoaded: true,
        });
      }
    )
    .then(
      error => {
        this.setState({
          ...this.state,
          error,
          isLoaded: true,
        });
      }
    )
  }

  selectBuzzword() {
    this.setState({
      ...this.state,
      isLoaded: false
    });
    const { textFields } = this.state;
    // Create Query
    const params = {
      "buzzwords": "true",
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
        console.log('JSON buzzword response: ', result);
        this.setState({
          ...this.state,
          error: null,
          isLoaded: true,
          buzz: result.buzzwords,
          textFields: {
            category: null,
            channel: null
          }
        });
        console.log('buzzwords: ', this.state.buzz);
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

  selectTag() {
    this.setState({
      ...this.state,
      isLoaded: false
    });
    const { textFields } = this.state;
    // Create Query
    const params = {
      "individual_tags": "true",
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
        console.log('JSON tags response: ', result);
        this.setState({
          ...this.state,
          error: null,
          isLoaded: true,
          tag: result.individual_tags,
          textFields: {
            category: null,
            channel: null
          }
        });
        console.log('tags: ', this.state.tag);
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

  selectDate() {
    this.setState({
      ...this.state,
      isLoaded: false
    });
    const { textFields } = this.state;
    // Create Query
    const params = {
      "days_til_trending": "true",
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
        console.log('JSON date response: ', result);
        this.setState({
          ...this.state,
          error: null,
          isLoaded: true,
          dates: result.days_til_trending,
          textFields: {
            category: null,
            channel: null
          }
        });
        console.log('trendingDays: ', this.state.dates);
      },
      error => {
        this.setState({
          ...this.state,
          error,
          isLoaded: true,
          //trendingDays: {},
          textFields: {
            category: null,
            channel: null
          }
        });
      }
    )
  }

  selectComment() {
    this.setState({
      ...this.state,
      isLoaded: false
    });
    const { textFields } = this.state;
    // Create Query
    const params = {
      "comments_data": "true",
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
        console.log('JSON comment response: ', result);
        this.setState({
          ...this.state,
          error: null,
          isLoaded: true,
          comments: result.comments_data,
          textFields: {
            category: null,
            channel: null
          }
        });
        console.log('comments: ', this.state.comments);
      },
      error => {
        this.setState({
          ...this.state,
          error,
          isLoaded: true,
          textFields: {
            category: null,
            channel: null
          }
        });
      }
    )
  }

  selectGlobalVideos() {
    this.setState({
      isLoaded: false
    });
    console.log('In global videos')
    fetch(`http://${SERVER_IP}:${SERVER_PORT}/world_videos`)
    .then(res => res.json())
    .then(
      results => {
        let gv = {
          one: 0,
          two: 0,
          three: 0,
          four: 0,
          other: 0
        };
        for (let video in results.unique_videos) {
          switch (results.unique_videos[video]) {
            case 1:
              gv.one++;
              break;
            case 2:
              gv.two++;
              break;
            case 3:
              gv.three++;
              break;
            case 4:
              gv.four++;
              break;
            default:
              console.log('New number!');
              gv.other++;
              break;
          }
        }
        this.setState({
          ...this.state,
          error: null,
          isLoaded: true,
          globalVideos: gv
        });
      }
    )
    .then(
      error => {
        this.setState({
          ...this.state,
          error,
          isLoaded: true,
          // globalVideos: {}
        });
      }
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { analysisSelection } = this.state;

    // Analysis Selection changed
    if(analysisSelection && analysisSelection !== prevState.analysisSelection) {
      this.setState({
        ...this.state,
        isLoaded: true
      }); 
    }
  }

  renderData(selected) {
    const { buzz, tag, trendingDays, topCategories, dates, comments, globalVideos } = this.state;
    let display;
    let metric;
    let value;
    console.log('Creating graphic')

    switch(selected) {
      case 1:
        display = [];
        if (JSON.stringify(buzz) === '{}') {
          return (
            <h4>
              No data on Top 10 Buzzwords to display.
            </h4>
          );
        }
        for (let key in buzz) {
          if(!(key === "a" || key === "the" || key === "of" || key === "was" || key === "by" || key === "an")) {
            display.push({word:key, count:buzz[key]});
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
              <Title text="Top 10 Buzzwords of Trending Videos" />
              <Animation />
            </Chart>
          </Paper>
        );

      case 2:
        display = [];
        if (JSON.stringify(tag) === '{}') {
          return (
            <h4>
              No data on Top 10 Tags to display.
            </h4>
          );
        }
        for (let key in tag) {
          if(!(key === "a" || key === "the" || key === "of" || key === "was" || key === "by" || key === "an")) {
            display.push({word:key, count:tag[key]});
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
              <Title text="Top 10 Tags of Trending Videos" />
              <Animation />
            </Chart>
          </Paper>
        );

      case 3:
        // Bar Graph: Top Days for Trending Videos
        display = [];
        if (JSON.stringify(trendingDays) === '{}') {
          return (
            <h4>
              No data on Top Days of the Week to display.
            </h4>
          );
        }
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
        if (JSON.stringify(topCategories) === '{}') {
          return (
            <h4>
              No data on Top 10 Trending Categories to display.
            </h4>
          );
        }
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

      case 5:
        //values for trending dates
        metric = [];
        value = [];
        if (JSON.stringify(dates) === '{}') {
          return (
            <h4>
              No data on Time 'til Trending to display.
            </h4>
          );
        }
        for (let key in dates) {
          metric.push(key)
          value.push(dates[key])
        }
        return (
          <Paper>
            <div>
              How long does it take for a video to trend?
            </div>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell align="right">{metric[2]}</TableCell>
                  <TableCell align="right">{value[2]} days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">{metric[3]}</TableCell>
                  <TableCell align="right">{value[3]} days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">{metric[0]}</TableCell>
                  <TableCell align="right">{value[0]} days</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell align="right">{metric[1]}</TableCell>
                  <TableCell align="right">{value[1]} days</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        );

      case 6:
        display = [];
        var i;
        if (! comments.length) {
          return (
            <h4>
              No data on Disabled Comments compared to Likes/Dislikes Ratio to display.
            </h4>
          );
        }
        for(i=0; i<comments.length; i++) {
          if(comments[i][2] === "True") {
            display.push({
              arg1 : comments[i][1],
              val1 : comments[i][0],
              arg2 : 0,
              val2 : 0
            });
          }
          else {
            display.push({
              arg2 : comments[i][1],
              val2 : comments[i][0],
              arg1 : 0,
              val1 : 0
            });
          }
        }
        console.log(display);
        return (
          <Paper>
            <Chart data={display}>
              <ArgumentAxis showGrid />
              <ValueAxis />
              <ScatterSeries
                valueField="val1"
                argumentField="arg1"
              />
              <ScatterSeries
                valueField="val2"
                argumentField="arg2"
              />
              <Title text="Disabled Comments Relation to Ratio of Likes to Dislikes" />
            </Chart>
          </Paper>
        );
      
      // Global Videos
      case 7:
        const { one, two, three, four } = globalVideos;
        const sum = one + two + three + four;
        if (! sum) {
          return (
            <h4>
              No data on Global Videos to display.
            </h4>
          );
        }
          return (
            <div>
              <br/>
              <h3>Global Videos</h3>
              <br/>
              <h5>{four} videos went trending in all four countries.</h5>
              <br/>
              <h5>{three} videos went trending in three out of four countries.</h5>
              <br/>
              <h5>{two} videos went trending in two out of four countries.</h5>
              <br/>
              <h5>{one} videos did not transend country boarders, and only went trending in one country.</h5>
            </div>
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
    const { error, isLoaded, analysisSelection, locationSelection } = this.state;
    console.log('Rendering...');
    if(error) {
      return (
        <div className='Analysis'>
          <NavBar />
          <header className='Analysis-header'>
            <h3>
              Error: {error.message}
            </h3>
          </header>
        </div>
      );
    }
    else if(!isLoaded) {
      return (
        <div className='Analysis'>
          <NavBar />
          <header className='Analysis-header'>
            <h3>
              Loading...
            </h3>
          </header>
        </div>
      );
    }
    else {
      return (
        <div className='Analysis'>
          <NavBar />
          <header>
            <AnalysisTop
              analysisSelection={analysisSelection}
              locationSelection={locationSelection}
              handleInputChange={this.handleInputChange} 
              handleSelectChange={this.handleSelectChange}
              handleFileChange={this.handleFileChange}
              handleClick={this.handleClick}
            />
          </header>
          <div>
            <br />
            {this.renderData(analysisSelection)}
          </div>
        </div>
      );
    }
  }
};

export default Analysis;
