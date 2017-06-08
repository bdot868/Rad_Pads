import React, {Component} from 'react'
import clientAuth from './clientAuth.js'
import './zillow.css'

class Zillow extends Component {


  componentDidMount(){
    clientAuth.returnedZillowInfo().then(res => {
      // this.setState({
      //   dataSetLocation:
      // })
    })
  }

  _newSearch(evt){
    evt.preventDefault();
    const locationData = {
      address: this.refs.address.value,
      citystatezip: this.refs.citystatezip.value
    }
    this.props.onSearch(locationData);
  }

  render() {

    return (
      <div>
        <h1>Get Property Info</h1>
        <form className="form-inline" onSubmit={this._newSearch.bind(this)}>
          <div className="form-group" id="address">
            <label>Enter Address</label>
            <input className="form-control" type='text' placeholder='Street Address' ref='address' id="zillow" value="209 Euclid St"/>
          </div>
          <div className="form-group" id="citystatezip">
            <label>Enter City/State or Zip code</label>
            <input className="form-control" type='text' placeholder='Ex... New York, NY or 11101' ref='citystatezip' id="zillow" value="90402"/>
          </div>

          <button className="btn" type='submit'>Search</button>
        </form>

        {/* <div>{this.state.listing}</div> */}
      </div>
    )
  }
}

export default Zillow
