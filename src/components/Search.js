import React from 'react';
import { SERVER_PORT } from '../globals';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField"
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function SimpleTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">video_id</TableCell>
            <TableCell align="right">title</TableCell>
            <TableCell align="right">channel_title</TableCell>
            <TableCell align="right">category_id</TableCell>
            <TableCell align="right">trending_date</TableCell>
            <TableCell align="right">publish_time</TableCell>
            <TableCell align="right">tags</TableCell>
            <TableCell align="right">thumbnail_link</TableCell>
            <TableCell align="right">views</TableCell>
            <TableCell align="right">likes</TableCell>
            <TableCell align="right">dislikes</TableCell>
            <TableCell align="right">comment_count</TableCell>
            <TableCell align="right">comments_disabled</TableCell>
            <TableCell align="right">ratings_disabled</TableCell>
            <TableCell align="right">video_error_or_removed</TableCell>
            <TableCell align="right">description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/*
    Database Columns:
        video_id
        trending_date
        title
        channel_title
        category_id
        publish_time
        tags
        views
        likes
        dislikes
        comment_count
        thumbnail_link
        comments_disabled
        ratings_disabled
        video_error_or_removed
        description
*/

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      runSearch: false,
      entries: [],
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

  handleClick() {
    this.setState({
      ...this.state,
      runSearch: true,
    });
    console.log('Search Button clicked.')
  }

  componentDidUpdate(prevProps, prevState) {
    const { error, isLoaded, runSearch, textFields } = this.state;
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
          this.setState({
            error: null,
            isLoaded: true,
            runSearch: false,
            entries: result,
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
            error,
            isLoaded: true,
            runSearch: false,
            entries: [],
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
    }
  }
  
  render() {
    const { error, isLoaded } = this.state;
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
            <TextField id="videoID" label="Video ID" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="trendingDate" label="Trending Date" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="views" label="Views" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="commentsDisabled" label="Comments Disabled" onChange={event => this.handleInputChange(event)} />
          </div>
          <div style ={{padding:20}}>
            <TextField id="title" label="Title" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="publishTime" label="Publish Time" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="likes" label="Likes" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="ratingsDisabled" label="Ratings Disabled" onChange={event => this.handleInputChange(event)} />
          </div>
          <div style ={{padding:20}}>
            <TextField id="channelTitle" label="Channel Title" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="tags" label="Tags" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="dislikes" label="Dislikes" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="videoErrorOrRemoved" label="Video Error Or Removed" onChange={event => this.handleInputChange(event)} />
          </div>
          <div style ={{padding:20}}>
            <TextField id="categoryID" label="Category ID" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="thumbnailLink" label="Thumbnail Link" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="commentCount" label="Comment Count" style={{marginRight: 10}} onChange={event => this.handleInputChange(event)} />
            <TextField id="description" label="Description" onChange={event => this.handleInputChange(event)} />
          </div>
          <div style={{padding:20}}>
            <Button variant="contained" color="primary" style={{marginRight:70}} onClick={this.handleClick}>
              SEARCH
            </Button>
            <Button variant="contained" color="default" style={{marginRight:70}}>
              INSERT
            </Button>
            <Button variant="contained" color="default" style={{marginRight:70}}>
              DELETE
            </Button>
            <Button variant="contained" color="secondary" >
              CLEAR FIELDS
            </Button>
          </div>
          <div>
            <SimpleTable />
          </div>
        </div>
      )
    }
  }
};

export default Search;
