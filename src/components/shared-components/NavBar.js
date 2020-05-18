import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import AssessmentIcon from '@material-ui/icons/Assessment';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
    alignSelf: 'center',
  },
  appBar: {
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
  },
}));

function NavBar(props) {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <HomeIcon onClick={() => alert('Clicked!!')} />
        </IconButton>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <SearchIcon onClick={() => alert('Clicked!!')} />
        </IconButton>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <AssessmentIcon onClick={() => alert('Clicked!!')} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
