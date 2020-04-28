import React from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField"
// import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import { SERVER_PORT, ButtonID } from '../globals';
import './Search.css'

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      runSearch: false,
      entries: [],
      selected: [],
      insertEntry: false,
      deteteEntry: false,
      updateEntry: false,
      textFields: {
        videoID: null,
        trendingDate: null,
        title: null,
        channelTitle: null,
        categoryID: null,
        publishTime: null,
        tags: null,
        views: null,
        likes: null,
        dislikes: null,
        commentCount: null,
        thumbnailLink: null,
        commentsDisabled: null,
        ratingsDisabled: null,
        videoErrorOrRemoved: null,
        description: null
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      isLoaded: true
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

  handleClick(type) {
     switch (type) {
      case ButtonID.search:
        this.setState({
          ...this.state,
          runSearch: true,
        });
        console.log('Search button clicked.');
        break;

      case ButtonID.insert:
        this.setState({
          ...this.state,
          insertEntry: true,
        });
        console.log('Insert button clicked');
        break;

      case ButtonID.update:
        this.setState({
          ...this.state,
          updateEntry: true,
        });
        console.log('Update button clicked');
        break;

      case ButtonID.delete:
        this.setState({
          ...this.state,
          deleteEntry: true,
        });
        console.log('Delete button clicked');
        break;
        
      default:
        console.log('Some other button clicked');
        break;
    } 
  }

  handleSelect(event) {
    const { id, checked } = event.target;
    const { entries , selected } = this.state;
    console.log('handleSelect first hit:', selected);
    console.log('id:', id, typeof(id));
    const idNum = parseInt(id, 10);
    console.log('idNum:', idNum, typeof(idNum));
    
    if(checked) {
      selected.push(entries[idNum][0]);   // EntryID
      this.setState({
        ...this.state,
        textFields: {
          videoID: entries[idNum][1],
          trendingDate: entries[idNum][2],
          title: entries[idNum][3],
          channelTitle: entries[idNum][4],
          categoryID: entries[idNum][5],
          publishTime: entries[idNum][6],
          tags: entries[idNum][7],
          views: entries[idNum][8],
          likes: entries[idNum][9],
          dislikes: entries[idNum][10],
          commentCount: entries[idNum][11],
          thumbnailLink: entries[idNum][12],
          commentsDisabled: entries[idNum][13],
          ratingsDisabled: entries[idNum][14],
          videoErrorOrRemoved: entries[idNum][15],
          description: entries[idNum][16]
        }
      });
      console.log('Row Selected.');
    } else {
      let filteredSelect = selected.filter((value, index, array) => {
        return value !== entries[idNum][0];
      });
      this.setState({
        ...this.state,
        selected: filteredSelect
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { 
      error, 
      isLoaded, 
      runSearch, 
      textFields,
      selected, 
      insertEntry, 
      deleteEntry, 
      updateEntry 
    } = this.state;

    // Search button clicked
    if (runSearch && runSearch !== prevState.runSearch) {
      // Show loading screen while data is being fetched
      this.setState({
        ...this.state,
        isLoaded: false
      });
      // Create Search Query
      const params = {
        "video_id": textFields.videoID,
        "trending_date": textFields.trendingDate,
        "title": textFields.title,
        "channel_title": textFields.channelTitle,
        "category_id": textFields.categoryID,
        "publish_time": textFields.publishTime,
        "tags": textFields.tags,
        "views": textFields.views,
        "likes": textFields.likes,
        "dislikes": textFields.dislikes,
        "comment_count": textFields.commentCount,
        "thumbnail_link": textFields.thumbnailLink,
        "comments_disabled": textFields.commentsDisabled,
        "ratings_disabled": textFields.ratingsDisabled,
        "video_error_or_removed": textFields.video_error_or_removed,
        "description": textFields.description
      };
      // Generate parameter string for query
      const esc = encodeURIComponent;
      let queryList = [];

      for (let key in params) {
        if (params[key]) {
          queryList.push(esc(key) + '=' + esc(params[key]))
        }
      }
      const query = queryList.join('&');
      // Hard-coded fetch to localhost
      fetch(`http://localhost:${SERVER_PORT}/data?${query}`)
      .then(res => res.json())
      .then(
        (result) => {
          console.log('JSON response: ', result);
          for (let i = 0; i < result.results.length ; i++) {
            result.results[i].unshift(result.resultsIndex[i]);
          }
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            runSearch: false,
            entries: result.results,
            textFields: {
              videoID: null,
              trendingDate: null,
              title: null,
              channelTitle: null,
              categoryID: null,
              publishTime: null,
              tags: null,
              views: null,
              likes: null,
              dislikes: null,
              commentCount: null,
              thumbnailLink: null,
              commentsDisabled: null,
              ratingsDisabled: null,
              videoErrorOrRemoved: null,
              description: null
            }
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            ...this.state,
            error,
            isLoaded: true,
            runSearch: false,
            textFields: {
              videoID: null,
              trendingDate: null,
              title: null,
              channelTitle: null,
              categoryID: null,
              publishTime: null,
              tags: null,
              views: null,
              likes: null,
              dislikes: null,
              commentCount: null,
              thumbnailLink: null,
              commentsDisabled: null,
              ratingsDisabled: null,
              videoErrorOrRemoved: null,
              description: null
            }
          });
        }
      )    
      if (isLoaded && !error) {
        console.log(`Search data from PORT ${SERVER_PORT} recieved successfully.`);
      }
    // Something was selected/de-selected
    } else if (selected !== prevState.selected) {
      this.setState({
        ...this.state,
        selected
      });
      console.log('Selected entries:', selected);
    // Insert entry
    } else if (insertEntry && insertEntry !== prevState.insertEntry) {
      this.setState({
        ...this.state,
        isLoaded: false
      });
      // Create insert query
      const params = {
        "video_id": textFields.videoID,
        "trending_date": textFields.trendingDate,
        "title": textFields.title,
        "channel_title": textFields.channelTitle,
        "category_id": textFields.categoryID,
        "publish_time": textFields.publishTime,
        "tags": textFields.tags,
        "views": textFields.views,
        "likes": textFields.likes,
        "dislikes": textFields.dislikes,
        "comment_count": textFields.commentCount,
        "thumbnail_link": textFields.thumbnailLink,
        "comments_disabled": textFields.commentsDisabled,
        "ratings_disabled": textFields.ratingsDisabled,
        "video_error_or_removed": textFields.video_error_or_removed,
        "description": textFields.description
      };
      const esc = encodeURIComponent;
      let queryList = [];

      for (let key in params) {
        if (params[key]) {
          queryList.push(esc(key) + '=' + esc(params[key]))
        }
      }
      const query = queryList.join('&');

      const requestOptions = {
        method: 'POST',
      };
      fetch(`http://localhost:${SERVER_PORT}/data?${query}`, requestOptions)
      .then(res => res.json())
      .then(
        (results) => {
          console.log("Status: ", results.status);
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            insertEntry: false,
            textFields: {
              videoID: null,
              trendingDate: null,
              title: null,
              channelTitle: null,
              categoryID: null,
              publishTime: null,
              tags: null,
              views: null,
              likes: null,
              dislikes: null,
              commentCount: null,
              thumbnailLink: null,
              commentsDisabled: null,
              ratingsDisabled: null,
              videoErrorOrRemoved: null,
              description: null
            }          });
        },
        (error) =>{
          this.setState({
            ...this.state,
            error,
            isLoaded: true,
            insertEntry: false,
            textFields: {
              videoID: null,
              trendingDate: null,
              title: null,
              channelTitle: null,
              categoryID: null,
              publishTime: null,
              tags: null,
              views: null,
              likes: null,
              dislikes: null,
              commentCount: null,
              thumbnailLink: null,
              commentsDisabled: null,
              ratingsDisabled: null,
              videoErrorOrRemoved: null,
              description: null
            }
          });
        }
      );
    // Delete Entry
    } else if (deleteEntry && deleteEntry !== prevState.deleteEntry) {
      this.setState({
        ...this.state,
        isLoaded: false
      });
      // Create delete query
      const esc = encodeURIComponent;
      let queryList = [];
  
      for (let key of this.state.selected) {
        if (key) {
          queryList.push(esc('indexes') + '=' + esc(key))
        }
      }
      const query = queryList.join('&');

      console.log('Selected:', query);

      const requestOptions = {
        method: 'DELETE',
      };
      fetch(`http://localhost:${SERVER_PORT}/data?${query}`, requestOptions)
      .then(res => res.json())
      .then(
        (results) => {
          console.log("Status: ", results.status);
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            deleteEntry: false,textFields: {
              videoID: null,
              trendingDate: null,
              title: null,
              channelTitle: null,
              categoryID: null,
              publishTime: null,
              tags: null,
              views: null,
              likes: null,
              dislikes: null,
              commentCount: null,
              thumbnailLink: null,
              commentsDisabled: null,
              ratingsDisabled: null,
              videoErrorOrRemoved: null,
              description: null
            }
          });
        },
        (error) =>{
          this.setState({
            ...this.state,
            error,
            isLoaded: true,
            deleteEntry: false,textFields: {
              videoID: null,
              trendingDate: null,
              title: null,
              channelTitle: null,
              categoryID: null,
              publishTime: null,
              tags: null,
              views: null,
              likes: null,
              dislikes: null,
              commentCount: null,
              thumbnailLink: null,
              commentsDisabled: null,
              ratingsDisabled: null,
              videoErrorOrRemoved: null,
              description: null
            }
          });
        }
      );
    // Update entry
    } else if (updateEntry && updateEntry !== prevState.updateEntry) {
      this.setState({
        ...this.state,
        isLoaded: false
      });
      const selectLength = this.state.selected.length;
      // Create update query
      const params = {
        "index": this.state.selected[selectLength - 1],
        "video_id": textFields.videoID,
        "trending_date": textFields.trendingDate,
        "title": textFields.title,
        "channel_title": textFields.channelTitle,
        "category_id": textFields.categoryID,
        "publish_time": textFields.publishTime,
        "tags": textFields.tags,
        "views": textFields.views,
        "likes": textFields.likes,
        "dislikes": textFields.dislikes,
        "comment_count": textFields.commentCount,
        "thumbnail_link": textFields.thumbnailLink,
        "comments_disabled": textFields.commentsDisabled,
        "ratings_disabled": textFields.ratingsDisabled,
        "video_error_or_removed": textFields.video_error_or_removed,
        "description": textFields.description
      };
      const esc = encodeURIComponent;
      let queryList = [];

      for (let key in params) {
        if (params[key]) {
          queryList.push(esc(key) + '=' + esc(params[key]))
        }
      }
      const query = queryList.join('&');

      const requestOptions = {
        method: 'PUT',
      };
      fetch(`http://localhost:${SERVER_PORT}/data?${query}`, requestOptions)
      .then(res => res.json())
      .then(
        (results) => {
          console.log("Status: ", results.status);
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            updateEntry: false,
            textFields: {
              videoID: null,
              trendingDate: null,
              title: null,
              channelTitle: null,
              categoryID: null,
              publishTime: null,
              tags: null,
              views: null,
              likes: null,
              dislikes: null,
              commentCount: null,
              thumbnailLink: null,
              commentsDisabled: null,
              ratingsDisabled: null,
              videoErrorOrRemoved: null,
              description: null
            }
          });
        },
        (error) =>{
          this.setState({
            ...this.state,
            error,
            isLoaded: true,
            updateEntry: false,
            textFields: {
              videoID: null,
              trendingDate: null,
              title: null,
              channelTitle: null,
              categoryID: null,
              publishTime: null,
              tags: null,
              views: null,
              likes: null,
              dislikes: null,
              commentCount: null,
              thumbnailLink: null,
              commentsDisabled: null,
              ratingsDisabled: null,
              videoErrorOrRemoved: null,
              description: null
            }
          });
        }
      );
    }
  }

  
  render() {
    const { error, isLoaded, entries } = this.state;
    console.log('Rendering...');
    if (error) {
      return (
        <div className="App">
          <h3>
            Error: {error.message}
          </h3>
        </div>
      );
    } else if (!isLoaded) {
      return (
        <div className="App">
          <h3>
            Loading...  
          </h3>
        </div>
      );
    // Initial render
    } else {
      return (
        <div className="App">
          <h1>Search Page</h1>
          <div style ={{padding:20}}>
            <TextField 
              id="videoID" 
              label="Video ID" 
              // defaultValue={this.state.videoID} 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="trendingDate" 
              label="Trending Date" 
              // defaultValue={this.state.trendingDate} 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="views" 
              label="Views" 
              // defaultValue={this.state.views}
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="commentsDisabled" 
              label="Comments Disabled" 
              // defaultValue={this.state.commentsDisabled}
              onChange={event => this.handleInputChange(event)} 
            />
          </div>
          <div style ={{padding:20}}>
            <TextField 
              id="title" 
              // defaultValue={this.state.title}
              label="Title" 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="publishTime" 
              // defaultValue={this.state.publishTime}
              label="Publish Time" 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="likes" 
              // defaultValue={this.state.likes}
              label="Likes" 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="ratingsDisabled" 
              // defaultValue={this.state.ratingsDisabled}
              label="Ratings Disabled" 
              onChange={event => this.handleInputChange(event)} 
            />
          </div>
          <div style ={{padding:20}}>
            <TextField 
              id="channelTitle" 
              // defaultValue={this.state.channelTitle}
              label="Channel Title" 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="tags" 
              // defaultValue={this.state.tags}
              label="Tags" 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="dislikes" 
              // defaultValue={this.state.dislikes}
              label="Dislikes" 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="videoErrorOrRemoved" 
              // defaultValue={this.state.videoErrorOrRemoved}
              label="Video Error Or Removed" 
              onChange={event => this.handleInputChange(event)} 
            />
          </div>
          <div style ={{padding:20}}>
            <TextField 
              id="categoryID" 
              // defaultValue={this.state.categoryID}
              label="Category ID" 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="thumbnailLink" 
              // defaultValue={this.state.thumbnailLink}
              label="Thumbnail Link" 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="commentCount" 
              // defaultValue={this.state.commentCount}
              label="Comment Count" 
              style={{marginRight: 10}} 
              onChange={event => this.handleInputChange(event)} 
            />
            <TextField 
              id="description" 
              // defaultValue={this.state.description}
              label="Description" 
              onChange={event => this.handleInputChange(event)} 
            />
          </div>
          <div style={{padding:20}}>
            <Button 
              variant="contained" 
              color="primary" 
              style={{marginRight:70}} 
              onClick={() => this.handleClick(ButtonID.search)}
            >
              SEARCH
            </Button>
            <Button 
              variant="contained" 
              color="default" 
              style={{marginRight:70}} 
              onClick={() => this.handleClick(ButtonID.insert)}
            >
              INSERT
            </Button>
            <Button 
              variant="contained" 
              color="default" 
              style={{marginRight:70}} 
              onClick={() => this.handleClick(ButtonID.update)}
            >
              UPDATE
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => this.handleClick(ButtonID.delete)}
            >
              DELETE
            </Button>
          </div>
          <div>
            <TextField id="file_name" label="File Name" style={{margin: 10}} />
            <Button variant="contained" color="secondary" style={{margin: 10}}>
              SAVE
            </Button>
            <Button variant="contained" color="default" style={{margin: 10}}>
              LOAD
            </Button>
          </div>
          <div>
            <TableContainer component={Paper}>
              <Table className="ResultsTable" size="small" aria-label="simple table">
                <TableHead>
                  <TableRow
                    hover
                    role="checkbox"
                  >
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell align="right">Entry ID</TableCell>
                    <TableCell align="right">Video ID</TableCell>
                    <TableCell align="right">Trending Date</TableCell>
                    <TableCell align="right">Title</TableCell>
                    <TableCell align="right">Channel Title</TableCell>
                    <TableCell align="right">Category ID</TableCell>
                    <TableCell align="right">Publish Time</TableCell>
                    <TableCell align="right">Tags</TableCell>
                    <TableCell align="right">Views</TableCell>
                    <TableCell align="right">Likes</TableCell>
                    <TableCell align="right">Dislikes</TableCell>
                    <TableCell align="right">Comment Count</TableCell>
                    <TableCell align="right">Thumbnail Link</TableCell>
                    <TableCell align="right">Comments Disabled</TableCell>
                    <TableCell align="right">Ratings Disabled</TableCell>
                    <TableCell align="right">Video Error or Removed</TableCell>
                    <TableCell align="right">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    entries.map((entry, index) => {
                      return (
                        <TableRow 
                          key={index}
                          hover
                          roll="checkbox"
                        >
                          <TableCell padding="checkbox">
                            <Checkbox 
                              id={index.toString()}
                              // checked={selected[index]}
                              onChange={this.handleSelect}
                            />
                          </TableCell>
                          <TableCell align="right">{entry[0]}</TableCell>
                          <TableCell align="right">{entry[1]}</TableCell>
                          <TableCell align="right">{entry[2]}</TableCell>
                          <TableCell align="right">{entry[3]}</TableCell>
                          <TableCell align="right">{entry[4]}</TableCell>
                          <TableCell align="right">{entry[5]}</TableCell>
                          <TableCell align="right">{entry[6]}</TableCell>
                          <TableCell align="right">{entry[7]}</TableCell>
                          <TableCell align="right">{entry[8]}</TableCell>
                          <TableCell align="right">{entry[9]}</TableCell>
                          <TableCell align="right">{entry[10]}</TableCell>
                          <TableCell align="right">{entry[11]}</TableCell>
                          <TableCell align="right">{entry[12]}</TableCell>
                          <TableCell align="right">{entry[13]}</TableCell>
                          <TableCell align="right">{entry[14]}</TableCell>
                          <TableCell align="right">{entry[15]}</TableCell>
                          <TableCell align="right">{entry[16]}</TableCell>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )
    }
  }
};

export default Search;
