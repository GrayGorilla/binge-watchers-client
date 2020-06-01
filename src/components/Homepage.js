import React from 'react';
import Button from "@material-ui/core/Button";
import logo from '../resources/logo-youtube.svg';
import NavBar from '../components/shared-components/NavBar';
import './Homepage.css';
import { SERVER_PORT, SERVER_IP } from '../globals';

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      showData: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      ...this.state,
      isLoaded: true
    });
  }
  
  handleClick() {
    this.setState({
      ...this.state,
      showData: true
    });
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { error, isLoaded, showData } = this.state;
    if (showData !== prevState.showData) {
      // Show loading screen while data is being fetched
      this.setState({
        ...this.state,
        isLoaded: false
      });
      // Hard-coded fetch to localhost:SERVER_PORT
      fetch(`http://${SERVER_IP}:${SERVER_PORT}/test`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            ...this.state,
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            ...this.state,
            isLoaded: true,
            error
          });
        }
      )    
      if (isLoaded && !error) {
        console.log(`Data from PORT ${SERVER_PORT} recieved`);
      }
    }
  }

  render() {
    const { error, isLoaded, items, showData } = this.state;
    if (error) {
      return (
        <div className="App">
          <NavBar />
          <header className="App-header">
            <h3>
              Error: {error.message}
            </h3>
          </header>
        </div>
      );
    } else if (!isLoaded) {
      return (
        <div className="App">
          <NavBar />
          <header className="App-header">
            <h3>
              Loading...  
            </h3>
          </header>
        </div>
      );
    // After button is pressed,
    // iterates through items array, displays each item on list
    } else if (showData) {
      return (
        <div className="App">
          <NavBar />
          <header className="App-header">
            <h1>Binge Watchers</h1>
            <img src={logo} className="App-logo" alt="logo" />
            <h4>Server Data Message:</h4>
            <ul className="List-homepage-data">
              {items.map(item => (
                <li key={item.message}>
                  {item.message}
                </li>
              ))}
            </ul>
          </header>
        </div>
      );
    // Initial render
    } else {
      return (
        <div className="App">
          <NavBar />
          <header className="App-header">
            <h1>Binge Watchers</h1>
            <img src={logo} className="App-logo" alt="logo" />
            <Button variant="contained" color="default" style={{margin:20}} onClick={this.handleClick}>
              GET DATA
            </Button>
            <p>Waiting on button press...</p>
          </header>
        </div>
      );
    }
  }
};

export default Homepage;
