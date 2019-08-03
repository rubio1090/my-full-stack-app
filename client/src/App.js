/*
import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };
  
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };
  
render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;
*/


/*
import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    cow: '',
    text: ''
  }

  componentDidMount() {
    this.fetchCow()
  }

  fetchCow = async () => {
    const response = await fetch(`/api/cow`)
    const initialCow = await response.json()
    const cow = initialCow.moo
    this.setState({ cow })
  }

  customCow = async evt => {
    evt.preventDefault()
    const text = this.state.text
    const response = await fetch(`/api/cow/${text}`)
    const custom = await response.json()
    const cow = custom.moo
    this.setState({ cow, text: '' })
  }

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  render() {
    return (
      <div className="App">
        <h3>Text Cow. Moo</h3>
        <code>{this.state.cow}</code>
        <form onSubmit={this.customCow}>
          <label>Custom Cow Text:</label>
          <input
            type="text"
            name="text"
            value={this.state.text}
            onChange={this.handleChange}
          />
          <button type="submit">Show me a talking cow!</button>
        </form>
      </div>
    )
  }
}

export default App

*/
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import "./App.css";
import Login from './components/login';
import AddUser from './components/addUser';
import EditUser from './components/editUser';
import Dashboard from './components/dashboard';
import TrailerView from './components/trailerView';
import Edit from './components/edit';
import Nav from './components/nav';


export default class App extends Component {
  constructor(){
    super();
    this.state = {
      isLoggedIn : false, 
      trailers : [],
      doors: [],
      contacts : [],
      users : [], 
      user : [], 
      checkStatusComplete : false, 
      editableTrailers : [], 
      donutChartData : {
        labels: ["Cactus", "Brodiaea", "Nandina"],
        datasets: [{
        label: "Trailer Count by Yard",
        backgroundColor: ['#0099cc', '#9494b8', '#94b8b8'],
        data: []
        }]
      },
      donutChartOptions :{
        cutoutPercentage : 40,
        animation : {
          easing : 'easeInOutQuint'
        },
        title : {
          display : true,
          text: "Trailer Count by Yard",
          fontSize : 20,
          fontColor : '#333333'
        },
        legend : {
          display : true,
          position : 'bottom'
        }
      },
      stackedChartData : {
        labels: ['Cactus', 'Brodiaea', 'Nandina'],
        datasets: [
          {
            stack: 'stack1',
            label: 'Empty',
            backgroundColor: ['#339966', '#339966', '#339966'],
            data: [1, 2, 3]
          },
          {
            stack: 'stack1',
            label: 'Full',
            backgroundColor: ['#ff9900', '#ff9900', '#ff9900'],
            data: [3, 4, 1]   
          }
        ]
      },
      stackedChartOptions :{
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        },
        legend : {
          display : true,
          position : 'bottom'
        },
        title : {
          display : true,
          text : "Trailer Count by Status",
          fontSize : 20,
          fontColor : '#333333'
        }
      }
    }
  }

  componentDidMount(){
    this.testConn();
    this.checkLoginStatus('user');
    this.getEditableTrailers();
    this.getTrailersList();
    this.getDoorList();
    this.getContacts();
    this.getUsers();
  }
  
  //test connection to the api
  testConn=()=>{
    fetch('/api/test')
      .then( res => res.json())
      .then( res => console.log(res.data))
  }

  checkLoginStatus=(cookieName)=>{
    let name = `${cookieName}=`;
    let cookieList = decodeURIComponent(document.cookie);
    let splitedCookies = cookieList.split(';');
    for(let i = 0; i<splitedCookies.length; i++){
      let c = splitedCookies[i];
      while(c.charAt(0) === ' '){
        c = c.substring(1);
      }
      if(c.indexOf(name) === 0){
        let username = c.substring(name.length, c.length);
        this.getUserInfo(username);
        return;
      }
    }
    this.setState({checkStatusComplete : true});
    return '';
  }
  refreshFromChild=()=>{
    this.getEditableTrailers();
    this.getTrailersList();
    this.getDoorList();
    this.getContacts();
    this.getUsers();
  }
  getTrailersList=()=>{
    window.fetch('/api/trailers')
      .then( res => res.json())
      .then( res => this.setState({ trailers : res.data }))
      .then(this.updateChartsData())
  }
  getContacts=()=>{
    window.fetch('/api/contacts')
      .then(res => res.json())
      .then(res => this.setState({ contacts : res.data }))
  }
  getDoorList=()=>{
    window.fetch('/api/doors')
      .then( res => res.json())
      .then( res => this.setState({ doors : res.data }))
  }
  getUsers=()=>{
    window.fetch('/api/users')
      .then(res => res.json())
      .then(res => this.setState({users : res.data}))
  }

  updateChartsData=()=>{
    let intr = setInterval(()=>{
      let {trailers} = this.state;
      let chartData = this.state.donutChartData;
      let stackedData = this.state.stackedChartData;
      let cac = 0, brd = 0, nan = 0;
      let cacE = 0, cacF = 0, brdE = 0, brdF = 0, nanE = 0, nanF = 0;

      if(trailers !== []){
        for(var i = 0; i<trailers.length; i++){
          if(trailers[i].DC === 'Cactus'){
            cac = cac + 1;
            if(trailers[i].IS_EMPTY === 1){
              cacE = cacE + 1;
            }else{
              cacF = cacF + 1;
            }
          }
          if(trailers[i].DC === 'Brodiaea'){
            brd = brd+1;
            if(trailers[i].IS_EMPTY === 1){
              brdE = brdE + 1;
            }else{
              brdF = brdF + 1;
            }
          }
          if(trailers[i].DC === 'Nandina'){
            nan = nan+1;
            if(trailers[i].IS_EMPTY === 1){
              nanE = nanE + 1;
            }else{
              nanF = nanF + 1;
            }
          }
        }
        chartData.datasets[0].data = [];
        stackedData.datasets[0].data = [];
        stackedData.datasets[1].data = [];

        chartData.datasets[0].data.push(cac, brd, nan);
        stackedData.datasets[0].data.push(cacE, brdE, nanE);
        stackedData.datasets[1].data.push(cacF, brdF, nanF);

        this.setState({
          donutChartData : chartData,
          stackedChartData : stackedData
        });
        clearInterval(intr);
      }
    }, 200);
  }
  sendBackendRequest=(endpoint, dataLoad)=>{
    const url = `/api/${endpoint}`;
    const data = dataLoad;
    const options = {
      headers : {'content-type' : 'application/json; charset=UTF-8'},
      body : JSON.stringify(data),
      made : 'cors',
      method : 'POST'
    };
    window.fetch(url, options)
      .then(res => res.json())
      .then(res => this.setState({addUserSuccess : res.data }))
  }
  getUserInfo=(username)=>{
  
    window.fetch(`/api/user?username=${username}`)
      .then(res => res.json())
      .then(res =>{
        if(res.success){
          this.setState({
            user : res.user[0],
            checkStatusComplete : true, 
            isLoggedIn : true
          });
        }else{
          this.setState({
            checkStatusComplete : true,
            isLoggedIn : false
          })
        }
      })
  }
  getEditableTrailers=()=>{
    window.fetch('/api/edit/trailers')
      .then( res => res.json())
      .then( res => this.setState({ editableTrailers : res.data }))
  }
  getCurrentUser=(user)=>{
    this.setState({user : user});
  }
  login=(user)=>{
    let date = new Date();
    date.setTime(date.getTime() + (12*60*60*1000));
    let expires = `expires= ${date.toUTCString()}`;
    document.cookie = `user= ${user.USER_NAME}; ${expires}`;
    this.setState({isLoggedIn : true});
  }
  logout=()=>{
    this.setState({isLoggedIn : false});
    document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  }
  
  render() {
    const {
      isLoggedIn,
      trailers, 
      doors, 
      contacts, 
      users, 
      user, 
      checkStatusComplete, 
      donutChartData, 
      donutChartOptions, 
      stackedChartData, 
      stackedChartOptions,
      editableTrailers
    } = this.state;

    return (
      <div className="container-fluid">
        <Router>
          <React.Fragment>
            {isLoggedIn ? <Nav user={user} logout={this.logout}/> : null}
            {!checkStatusComplete ? null : 
            <Switch>
              
              <Route exact path="/" render={(props)=> 
                <Dashboard {...props}
                  trailers={trailers}
                  doors={doors}
                  contacts={contacts}
                  isLoggedIn={isLoggedIn}
                  donutChartData={donutChartData}
                  donutChartOptions={donutChartOptions}
                  stackedChartData={stackedChartData}
                  stackedChartOptions={stackedChartOptions}
                  updateUser={this.getCurrentUser.bind(this)}
                />} />

              <Route exact path="/trailers" render={(props)=>
                <TrailerView {...props}
                  trailers={trailers}
                  doors={doors}
                  isLoggedIn={isLoggedIn}
                  refreshList={this.getTrailersList}
                  refreshDoors={this.getDoorList}
                />}/>

              <Route exact path="/editor" render={(props)=>
                <Edit {...props}
                  contacts={contacts}
                  doors={doors}
                  users={users}
                  user={user}
                  isLoggedIn={isLoggedIn}
                  trailers={editableTrailers}
                  refreshData={this.refreshFromChild}/>}
                />

              <Route exact path="/edituser" render={(props)=>
                <EditUser {...props}
                  refreshData={this.refreshFromChild}
                  user={user}
                  isLoggedIn={isLoggedIn} />}/>


              <Route exact path="/adduser" render={(props)=>
                <AddUser {...props}
                  refreshData={this.refreshFromChild} 
                  isLoggedIn={isLoggedIn} />}/>

              <Route exact path="/login" render={(props)=>
                <Login {...props}
                  isLoggedIn={this.isLoggedIn}
                  getCurrentUser={this.getCurrentUser}
                  login={this.login} />}/>
              
            </Switch>
              }
          </React.Fragment>
        </Router>
      </div>
    );
  }
}
