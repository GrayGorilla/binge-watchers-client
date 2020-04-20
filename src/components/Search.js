import React from 'react';
import { SERVER_PORT } from '../globals';
import ReactDOM from "react-dom";
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

class Search extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return(
    <div>
      <div style ={{padding:20}}>
        <TextField id="text_field_video" label="video_id" style={{marginRight: 10}}/>
        <TextField id="text_field_trend" label="trending_date" style={{marginRight: 10}}/>
        <TextField id="text_field_view" label="views" style={{marginRight: 10}}/>
        <TextField id="text_field_comment_disable" label="comments_disabled" />
      </div>
      <div style ={{padding:20}}>
        <TextField id="text_field_title" label="title" style={{marginRight: 10}}/>
        <TextField id="text_field_publish" label="publish_time" style={{marginRight: 10}}/>
        <TextField id="text_field_like" label="likes" style={{marginRight: 10}}/>
        <TextField id="text_field_rate_disable" label="ratings_disabled" />
      </div>
      <div style ={{padding:20}}>
        <TextField id="text_field_channel" label="channel_title" style={{marginRight: 10}}/>
        <TextField id="text_field_tag" label="tags" style={{marginRight: 10}}/>
        <TextField id="text_field_dislike" label="dislikes" style={{marginRight: 10}}/>
        <TextField id="text_field_error" label="video_error_or_removed" />
      </div>
      <div style ={{padding:20}}>
        <TextField id="text_field_category" label="category_id" style={{marginRight: 10}}/>
        <TextField id="text_field_thumb" label="thumbnail_link" style={{marginRight: 10}}/>
        <TextField id="text_field_comment" label="comment_count" style={{marginRight: 10}}/>
        <TextField id="text_field_description" label="description" />
      </div>
      <div style={{padding:20}}>
        <Button variant="contained" color="primary" style={{marginRight:70}}>
          search
        </Button>
        <Button variant="contained" color="default" style={{marginRight:70}}>
          insert
        </Button>
        <Button variant="contained" color="default" style={{marginRight:70}}>
          delete
        </Button>
        <Button variant="contained" color="secondary" >
          clear_fields
        </Button>
      </div>
      <div>
        <SimpleTable />
      </div>
    </div>
  )
  }
};

export default Search;
