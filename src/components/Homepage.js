import React from 'react';
import logo from '../resources/logo-youtube.svg';
import './Homepage.css';

const serverPort = 5000;

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
      // Hard-coded fetch to localhost:serverPort
      fetch(`http://localhost:${serverPort}/data`)
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
        console.log(`Data from PORT ${serverPort} recieved`);
      }
    }
  }

  render() {
    const { error, isLoaded, items, showData } = this.state;
    if (error) {
      return (
        <div className="App">
          <header className="App-header">
            Error: {error.message}
          </header>
        </div>
      );
    } else if (!isLoaded) {
      return (
        <div className="App">
          <header className="App-header">
            Loading...  
          </header>
        </div>
      );
    // After button is pressed,
    // iterates through items array, displays each item on list
    } else if (showData) {
      return (
        <div className="App">
          <header className="App-header">
            <h1>Binge Watchers</h1>
            <img src={logo} className="App-logo" alt="logo" />
            <h4>Server Data Recieved</h4>
            <ul>
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
          <header className="App-header">
            <h1>Binge Watchers</h1>
            <img src={logo} className="App-logo" alt="logo" />
            <button onClick={this.handleClick}>
              Get Data
            </button>
            <p>Waiting on button press...</p>
          </header>
        </div>
      );
    }
  }
};

export default Homepage;
