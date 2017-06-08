import React, { Component } from 'react';
import axios from 'axios'
import './App.css'
import clientAuth from './clientAuth'
import Zillow from './zillow'


class App extends Component {

  constructor(){
    super()
    this.state = {
      currentUser: null,
      loggedIn: false,
      dataSetLocation: null,
      view: 'home'
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
        view: 'home'
      })
    });

  }


  render() {
    var listing = this.state.dataSetLocation


    return (
      <div className="App">
        <div className="App-header">
          <h2>{!this.state.loggedIn ? 'Log in buster!' : null}</h2>
          <ul className="nav nav-tabs">
            {
              <li><button name='home' onClick={this._setView.bind(this)}>Home</button></li>
            }
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
          profile: <Profile myUser={this.state.currentUser} />,
          zillow: <Zillow onSearch={this._zillowData}/>
        }[this.state.view]}
      </div>
        {listing
          ? (
            <div className='listing'>
              <p>City: {listing.address.city}</p>
              <p>State: {listing.address.state}</p>
              <p>Street: {listing.address.street}</p>
              <p>Zipcode: {listing.address.zipcode}</p>
              <p><strong>{listing.useCode}</strong></p>
              <p>Address: {listing.address.street}, {listing.address.city}, {listing.address.state}</p>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>{listing.finishedSqFt} Sq.ft</th>
                      <th>{listing.bedrooms} Beds</th>
                      <th>{listing.bathrooms} Baths</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <h3>Your home is worth:</h3>
              <h2>${listing.zestimate.amount['$t']}</h2>
              <button>Save Quote</button>
            </div>
          )
          : null
        }
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
  constructor(props){
    super(props)
  }


  render() {

    return (
      <div className="container">
        {this.props.myUser.name}
      </div>
    //   {/* <div>saved listing and favorited listings</div> */}
     )

  }

}

export default App;
