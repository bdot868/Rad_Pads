import React, { Component } from 'react';
import './App.css'
import clientAuth from './clientAuth'
import Zillow from './zillow'
var ReactBootstrap = require('react-bootstrap')
var Modal = ReactBootstrap.Modal


class App extends Component {

  constructor(){
    super()
    this.state = {
      currentUser: null,
      loggedIn: false,
      dataSetLocation: null,
      view: 'zillow'
    }
    this._login=this._login.bind(this)
    this._signUp=this._signUp.bind(this)
    this._zillowData=this._zillowData.bind(this)
  }

  componentDidMount() {
    const currentUser = clientAuth.getCurrentUser()
    this.setState({
      currentUser: currentUser,
      loggedIn: !!currentUser,
    })
  }

  _signUp(newUser) {
    clientAuth.signUp(newUser).then((data) => {
      console.log(data)
      this.setState({
        view: 'login'
      })
    })
  }

  _login(credentials) {
    clientAuth.logIn(credentials).then(user => {
      this.setState({
        currentUser: user,
        loggedIn: true,
        view: 'zillow'
      })
    })
  }

  _logOut() {
    clientAuth.logOut().then(message => {
      this.setState({
        currentUser: null,
        loggedIn: false,
        view: 'home'
      })
    })
  }

  _setView(evt) {
    evt.preventDefault()
    const view = evt.target.name
    this.setState({
      view: view
    })
  }

  _zillowData(data) {

    clientAuth.getLocationInfo(data).then((apiLocationData) => {

      console.log(apiLocationData)
      this.setState({
        dataSetLocation: apiLocationData.data["SearchResults:searchresults"].response.results.result,
        view: 'zillow'
      })
    });

  }

  _clearSearch() {
    this.setState({
      dataSetLocation: null
    })
  }

  // _addQuote(evt){
  //   evt.preventDefault()
  //   const newQuote = {
  //     street: this.state.dataSetLocation.address.street,
  //     city: this.state.dataSetLocation.address.city,
  //     state: this.state.dataSetLocation.address.state,
  //     zestimate: this.state.dataSetLocation.zestimate.amount['$t'],
  //     useCode: this.state.dataSetLocation.useCode,
  //   }
  //   console.log(newQuote)
  //   clientAuth.addQuote(newQuote).then(res => {
  //     console.log(res.data)
  //     this.setState({
  //       dataSetLocation: [
  //         ...this.state.dataSetLocation,
  //         res.data
  //       ]
  //     })
  //   })
  // }

  render() {
    var listing = this.state.dataSetLocation


    return (
      <div className="App">
        <div className="App-header">
          <h2>{!this.state.loggedIn ? 'Log in buster!' : null}</h2>
          <ul className="nav nav-tabs">
            {/* {
              <li><button name='home' onClick={this._setView.bind(this)}>Home</button></li>
            } */}
            {!this.state.loggedIn && (
              <li><button name='signup' onClick={this._setView.bind(this)}>Sign Up</button></li>
            )}
            {!this.state.loggedIn && (
              <li><button name='login' onClick={this._setView.bind(this)}>Log In</button></li>
            )}
            {this.state.loggedIn &&(
                <li><button name='zillow' onClick={this._setView.bind(this)}>Zillow</button></li>
            )}
            {this.state.loggedIn && (
              <button name="profile" onClick={this._setView.bind(this)}>Profile page</button>
            )}
            {this.state.loggedIn && (
              <li><button onClick={this._logOut.bind(this)}>Log out</button></li>
            )}
          </ul>
        </div>


        <div>
        {{
          home: <h1>Property Data</h1>,
          login: <LogIn onLogin={this._login} />,
          signup: <SignUp onSignup={this._signUp} />,
          profile: <Profile myUser={this.state.currentUser} quotes={listing} onDismissModal={this._clearSearch.bind(this)}/>,
          zillow: (
            <Zillow
              onSearch={this._zillowData}
              data={this.state.dataSetLocation}
              onDismissModal={this._clearSearch.bind(this)}
            />
          )
        }[this.state.view]}
      </div>

      </div>
    );
  }
}

class SignUp extends Component {
  _handleSignup(evt) {
    evt.preventDefault()
    const newUser = {
      name: this.refs.name.value,
      email: this.refs.email.value,
      password: this.refs.password.value
    }
    this.props.onSignup(newUser)
  }

  render() {
    return (
      <div className='container'>
        <h2>Sign Up</h2>
        <form className="form-horizontal" onSubmit={this._handleSignup.bind(this)}>
          <div className="form-group">
            <input className="form-control" type="text" placeholder="Name" ref="name" />
          </div>
          <div className="form-group">
            <input className="form-control" type="email" placeholder="Email" ref="email" />
          </div>
          <div className="form-group">
            <input className="form-control" type="password" placeholder="Password" ref="password" />
          </div>
          <div>
            <button className="btn btn-success" type="submit">Create Account</button>
          </div>
        </form>
      </div>
    )
  }
}

class LogIn extends Component {
  _handleLogin(evt) {
    evt.preventDefault()
    const credentials = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }
    this.props.onLogin(credentials)
  }

  render() {
    return (
      <div className='log-in'>
        <h2>Log In</h2>
        <form className="form-horizontal" onSubmit={this._handleLogin.bind(this)}>
          <div className="form-group">
            {/* <label className="col-sm-2 control-label">Email</label> */}
            <div className="col-sm-10">
              <input className="form-control" type="text" placeholder="Email" ref="email" id='log-in'/>
            </div>
          </div>
          <div>
            {/* <label className="col-sm-2 control-label">Password</label> */}
            <div className="col-sm-10">
              <input className="form-control" type="password" placeholder="Password" ref="password" id="log-in"/>
            </div>
          </div>
          <div>
            <div>
              <button type="submit" className="btn btn-success" >Log In</button>
            </div>
          </div>
        </form>
      </div>

    )
  }
}

class Profile extends Component {
  state = {
    quotes: [],
    toggleQuote: false,
    selectedQuote:{},
  }

  componentDidMount(){
    clientAuth.getQuotes().then(res => {
      // console.log(res.data);
      this.setState({
        quotes: res.data
      })
    })
  }

  _deleteQuote(id){
    clientAuth.deleteQuote(id).then((res => {
      this.setState({
        quotes: this.state.quotes.filter((quote) => {
          return quote._id !== id
        })
      })
    }))
  }

  _showInfo(quote){
    console.log('show something')
    console.log(quote);
    this.setState({
      toggleQuote: !this.state.toggleQuote,
      selectedQuote: quote,
    })
  }
  _clearToggle() {
    this.setState({
      toggleQuote: null
    })
  }


  render() {
    // console.log(this.state.quotes);
    const quotes = this.state.quotes.map((quote, i) => {
      // console.log(quote);
      return (
        <div key={i} onClick={this._showInfo.bind(this, quote)}>
        <div id="quote-div"  >
          <p><span>{quote.street}, {quote.city}, {quote.state}</span></p>
          <p><strong>{quote.useCode}</strong></p>
          <h4>${quote.zestimate}</h4>
        </div>
        <button onClick={this._deleteQuote.bind(this, quote._id)} className="glyphicon glyphicon-trash"></button>
      </div>
      )
    })
    return (
      <div className="container">
        <div>
          <h1 id='username'>{this.props.myUser.name}</h1>
        </div>
        <hr></hr>
        <div>
          {quotes}
        </div>
        <Modal show={!!this.state.toggleQuote} onHide={this._clearToggle.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title id="title">Property Data</Modal.Title>
          </Modal.Header>
            <Modal.Body>
            <div className='listing'>
              <p><strong>City:</strong>: {this.state.selectedQuote.city}</p>
              <p><strong>State:</strong> {this.state.selectedQuote.state}</p>
              <p><strong>Street:</strong> {this.state.selectedQuote.street}</p>
              <p><strong>Zipcode:</strong> {this.state.selectedQuote.zipcode}</p>
              <p><i>{this.state.selectedQuote.useCode}</i></p>
              <h3>Home Value:</h3>
              <h2>${this.state.selectedQuote.zestimate}</h2>
            </div>
            </Modal.Body>
          </Modal>
      </div>

     )

  }

}

export default App;
