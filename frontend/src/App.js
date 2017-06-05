import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css'
import clientAuth from './clientAuth'


class App extends Component {

  constructor(){
    super()
    this.state = {
      currentUser: null,
      loggedIn: false,
      view: 'home'
    }
    this._login=this._login.bind(this)
    this._signUp=this._signUp.bind(this)
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
        view: 'home'
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

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.state.loggedIn ? this.state.currentUser.name : 'Log in buster!'}</h2>
        </div>
        <ul>
          {!this.state.loggedIn && (
            <li><button name='signup' onClick={this._setView.bind(this)}>Sign Up</button></li>
          )}
          {!this.state.loggedIn && (
            <li><button name='login' onClick={this._setView.bind(this)}>Log In</button></li>
          )}
          {this.state.loggedIn && (
            <li><button onClick={this._logOut.bind(this)}>Log out</button></li>
          )}
          {/* {this.state.loggedIn && (
            <button name="profile" onClick={this._userProfile.bind(this)}>Profile page</button>
          )} */}
        </ul>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {{
          home: <h1>The Home View</h1>,
          login: <LogIn onLogin={this._login} />,
          signup: <SignUp onSignup={this._signUp} />,
          // profile: <Profile onProfile={this._signUp.bind(this)} />
        }[this.state.view]}
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
        <form onSubmit={this._handleSignup.bind(this)}>
          <input type="text" placeholder="Name" ref="name" />
          <input type="text" placeholder="Email" ref="email" />
          <input type="password" placeholder="Password" ref="password" />
          <button type="submit">Create Account</button>
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
      <div className='container'>
        <h2>Log In</h2>
        <form onSubmit={this._handleLogin.bind(this)}>
          <input type="text" placeholder="Email" ref="email" />
          <input type="password" placeholder="Password" ref="password" />
          <button type="submit">Log In</button>
        </form>
      </div>
    )
  }
}

class Profile extends Component {
  _userProfile(evt) {
    evt.preventDefault()

  }
  render() {
    return (
      <div className="container">
        <h2>{this.state.currentUser.name}</h2>
      </div>
    //   {/* <div>saved listing and favorited listings</div> */}
     )
  }
}

export default App;
