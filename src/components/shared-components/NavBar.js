import React from 'react';
import { Link } from 'react-router-dom';
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
    color: 'white',
  },
  appBar: {
    alignItems: 'center',
    backgroundColor: '#1d1d1d',
  },
  title: {
    flexGrow: 1,
  },
}));

const NavBar = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Link to="/">
            <IconButton edge="start" className={classes.menuButton} aria-label="menu">
              <HomeIcon />
            </IconButton>
          </Link>
          <Link to="/search">
            <IconButton edge="start" className={classes.menuButton} aria-label="menu">
              <SearchIcon />
            </IconButton>
          </Link>
          <Link to ="/analysis">
            <IconButton edge="start" className={classes.menuButton} aria-label="menu">
              <AssessmentIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
