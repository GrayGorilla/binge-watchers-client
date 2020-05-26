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
import EllipsisText from "react-ellipsis-text";

import NavBar from '../components/shared-components/NavBar';
import { SERVER_PORT, SERVER_IP, ButtonID } from '../globals';
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
      saveInstance: false,
      loadInstance: false,
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
        description: null,
        fileName: null
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
        console.log('Insert button clicked.');
        break;

      case ButtonID.update:
        this.setState({
          ...this.state,
          updateEntry: true,
        });
        console.log('Update button clicked.');
        break;

      case ButtonID.delete:
        this.setState({
          ...this.state,
          deleteEntry: true,
        });
        console.log('Delete button clicked.');
        break;

      case ButtonID.save:
        this.setState({
          ...this.state,
          saveInstance: true,
        });
        console.log('Save button clicked.');
        break;

      case ButtonID.load:
        this.setState({
          ...this.state,
          loadInstance: true,
        });
        console.log('Save button clicked.');
        break;
          
      default:
        console.log('Some other button clicked');
        break;
    } 
  }

  handleSelect(event) {
    const { id, checked } = event.target;
    const { entries , selected } = this.state;
    const idNum = parseInt(id, 10);
    
    if (checked) {
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
      let filteredSelect = selected.filter(value => {
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
      updateEntry,
      saveInstance,
      loadInstance
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
      // Hard-coded fetch to ${SERVER_IP}
      fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`)
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
            selected: [],
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
            selected: [],
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
      fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`, requestOptions)
      .then(res => res.json())
      .then(
        (results) => {
          console.log("Status: ", results.status);
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            insertEntry: false,
            entries: [],
            selected: [],
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
            insertEntry: false,
            entries: [],
            selected: [],
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
      const requestOptions = {
        method: 'DELETE',
      };
      fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`, requestOptions)
      .then(res => res.json())
      .then(
        (results) => {
          console.log("Status: ", results.status);
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            deleteEntry: false,
            entries: [],
            selected: [],
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
            deleteEntry: false,
            entries: [],
            selected: [],
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
      fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`, requestOptions)
      .then(res => res.json())
      .then(
        (results) => {
          console.log("Status: ", results.status);
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            updateEntry: false,
            entries: [],
            selected: [],
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
              description: null,
              fileName: null
            }
          });
        },
        (error) =>{
          this.setState({
            ...this.state,
            error,
            isLoaded: true,
            updateEntry: false,
            entries: [],
            selected: [],
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
              description: null,
              fileName: null
            }
          });
        }
      );
    // Save current dataset
    } else if (saveInstance && saveInstance !== prevState.saveInstance) {
      this.setState({
        ...this.state,
        isLoaded: false
      });
      // Create save query
      const esc = encodeURIComponent;
      const query = esc('filename') + '=' + esc(textFields.fileName);
      const requestOptions = { method: 'PUT' };

      fetch(`http://${SERVER_IP}:${SERVER_PORT}/backup?${query}`, requestOptions)
      .then(res => res.json())
      .then(
        (results) => {
          console.log("Status: ", results.status);
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            saveInstance: false,
            entries: [],
            selected: [],
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
              description: null,
              fileName: null
            }
          });
        },
        (error) =>{
          this.setState({
            ...this.state,
            error,
            isLoaded: true,
            saveInstance: false,
            entries: [],
            selected: [],
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
              description: null,
              fileName: null
            }
          });
        }
      );
    // Load new dataset
    } else if (loadInstance && loadInstance !== prevState.loadInstance) {
      this.setState({
        ...this.state,
        isLoaded: false
      });
      // Create load query
      console.log('textfield:::', textFields.fileName)
      const esc = encodeURIComponent;
      const query = esc('filename') + '=' + esc(textFields.fileName);
      console.log('query:::', query)
      const requestOptions = { method: 'GET' };

      fetch(`http://${SERVER_IP}:${SERVER_PORT}/backup?${query}`, requestOptions)
      .then(res => res.json())
      .then(
        (results) => {
          console.log("Status: ", results.status);
          this.setState({
            ...this.state,
            error: null,
            isLoaded: true,
            loadInstance: false,
            entries: [],
            selected: [],
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
              description: null,
              fileName: null
            }
          });
        },
        (error) =>{
          this.setState({
            ...this.state,
            error,
            isLoaded: true,
            loadInstance: false,
            entries: [],
            selected: [],
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
              description: null,
              fileName: null
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
        <div className="Search">
          <NavBar />
          <header className="Search-header">
            <br />
            <h3>
              Error: {error.message}
            </h3>
          </header>
        </div>
      );
    } else if (!isLoaded) {
      return (
        <div className="Search">
          <NavBar />
          <header className="Search-header">
            <h3>
              Loading...  
            </h3>
          </header>
        </div>
      );
    // Search Page
    } else {
      return (
        <div className="Search">
          <NavBar />
          <header>
            <h1>Search Page</h1>
            <div style ={{padding:20}}>
              <TextField 
                id="videoID" 
                label="Video ID" 
                type="search"
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
              <TextField 
                id="fileName" 
                label="File Name" 
                style={{margin: 10}} 
                onChange={event => this.handleInputChange(event)}
              />
              <Button 
                variant="contained" 
                color="default" 
                style={{margin: 10}} 
                onClick={() => this.handleClick(ButtonID.save)}
              >
                SAVE
              </Button>
              <Button 
                variant="contained" 
                color="default" 
                style={{margin: 10}}
                onClick={() => this.handleClick(ButtonID.load)}
              >
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
                      <TableCell align="center">Entry ID</TableCell>
                      <TableCell align="center">Video ID</TableCell>
                      <TableCell align="center">Trending Date</TableCell>
                      <TableCell align="center">Title</TableCell>
                      <TableCell align="center">Channel Title</TableCell>
                      <TableCell align="center">Category ID</TableCell>
                      <TableCell align="center">Publish Time</TableCell>
                      <TableCell align="center">Tags</TableCell>
                      <TableCell align="center">Views</TableCell>
                      <TableCell align="center">Likes</TableCell>
                      <TableCell align="center">Dislikes</TableCell>
                      <TableCell align="center">Comment Count</TableCell>
                      <TableCell align="center">Thumbnail Link</TableCell>
                      <TableCell align="center">Comments Disabled</TableCell>
                      <TableCell align="center">Ratings Disabled</TableCell>
                      <TableCell align="center">Video Error or Removed</TableCell>
                      <TableCell align="center">Description</TableCell>
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
                            <TableCell align="center">{entry[0]}</TableCell>
                            <TableCell align="center">{entry[1]}</TableCell>
                            <TableCell align="center">{entry[2]}</TableCell>
                            <TableCell align="center">
                              <EllipsisText text={entry[3]} length="30" />
                            </TableCell>
                            <TableCell align="center">{entry[4]}</TableCell>
                            <TableCell align="center">{entry[5]}</TableCell>
                            <TableCell align="center">{entry[6]}</TableCell>
                            <TableCell align="center">
                              <EllipsisText text={entry[7]} length="30" />
                            </TableCell>
                            <TableCell align="center">{entry[8]}</TableCell>
                            <TableCell align="center">{entry[9]}</TableCell>
                            <TableCell align="center">{entry[10]}</TableCell>
                            <TableCell align="center">{entry[11]}</TableCell>
                            <TableCell align="center">
                              <EllipsisText text={entry[12]} length="30" />
                            </TableCell>
                            <TableCell align="center">{entry[13]}</TableCell>
                            <TableCell align="center">{entry[14]}</TableCell>
                            <TableCell align="center">{entry[15]}</TableCell>
                            <TableCell align="center">
                              <EllipsisText text={entry[16]} length="30" />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </header>
        </div>
      )
    }
  }
};


//hello
export default Search;
