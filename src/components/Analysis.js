import React from 'react';
import { SERVER_PORT, SERVER_IP } from '../globals';
import './Analysis.css';
import AnalysisTop from './AnalysisTop';
let analytics = 0;

class Analysis extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      selection: null,
      buzzwords: [],
      categoryCount: {},
      textFields: {
        category: null,
        channel: null
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
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
    switch (value) {
      case 1:
        console.log('In handleSelectChange() - Buzzwords!');
      break;
      case 2:
        console.log('In handleSelectChange() - Tags!');
      break;
      case 3:
        console.log('In handleSelectChange() - Day of the Week!');
      break;
      case 4:
        console.log('In handleSelectChange() - Category!');
        this.selectCategories();
      break;
    }
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
          categoryCount: result.category_count,
          textFields: {
            category: null,
            channel: null
          }
        });
        console.log('categoryCount: ', this.state.categoryCount);
      },
      error => {
        this.setState({
          ...this.state,
          error,
          isLoaded: true,
          // todo: set category data to null
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
    if(selection === 1 && selection !== prevState.selection) {
      this.setState({
        ...this.state,
        isLoaded: false
      });
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
        if(params[key]) {
          queryList.push(esc(key) + '=' + esc(params[key]))
        }
      }
      const query = queryList.join('&');
      // Hard coded fetch to server ip
      const requestOptions = {
        buzzwords: 'true',
      };
      fetch(`http://${SERVER_IP}:${SERVER_PORT}/data?${query}`)
      .then(res => res.json())
      .then( 
        (result) => {
          console.log('JSON response: ', result);
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
          console.log('buzzwords', this.state.buzzwords);
        },
        (error) => {
          this.setState({
            ...this.state,
            error,
            isLoaded: true,
            buzzwords: [],
            textFields: {
              category: null,
              channel: null,
            }
          });
        }
      )
    }
  }

  renderData(selected) {
    console.log('Creating graphic')
    switch(selected) {
      case 1:
        return(
          <div>
            Buzzword
          </div>
        );
      case 2:
        return(
          <div>
            Tags
          </div>
        );
      case 3:
        return(
          <div>
            Day of the Week
          </div>
        );
      case 4:
        return(
          <div>
            Category
          </div>
        );
      default:
        return(
          <div>
            Here 
          </div>
        );    
    }
  }

  render() {
    const { error, isLoaded, selection, buzzwords } = this.state;
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
