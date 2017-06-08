import React, {Component} from 'react'
import clientAuth from './clientAuth.js'
import './zillow.css'

class Zillow extends Component {

  constructor(){
    super()

    this.state = {
      quotes: null
    }
  }


  componentDidMount(){
    clientAuth.getQuotes().then(res => {
      this.setState({
        quotes: res.data
      })
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

  _addQuote(evt){
    evt.preventDefault()
    const newQuote = {
      street: this.props.data.address.street,
      city: this.props.data.address.city,
      state: this.props.data.address.state,
      zestimate: this.props.data.zestimate.amount['$t'],
      useCode: this.props.data.useCode,
    }
    console.log(newQuote)
    clientAuth.addQuote(newQuote).then(res => {
      console.log(res.data)
      this.setState({
        quotes: [
          ...this.state.quotes,
          res.data
        ]
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

  render() {
    var listing = this.props.data
    console.log(listing)

    return (
      <div>
        <h1>Get Property Info</h1>
        <form className="form-inline" onSubmit={this._newSearch.bind(this)}>
          <div className="form-group" id="address">
            <label>Enter Address</label>
            <input className="form-control" type='text' placeholder='Street Address' ref='address' id="zillow" value="1255 Palisades Beach Rd"/>
          </div>
          <div className="form-group" id="citystatezip">
            <label>Enter City/State or Zip code</label>
            <input className="form-control" type='text' placeholder='Ex... New York, NY or 11101' ref='citystatezip' id="zillow" value="90401"/>
          </div>

          <button className="btn" type='submit'>Search</button>
        </form>

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
              <button id="save" onClick={this._addQuote.bind(this)}>Save Quote</button>
            </div>
          )
          : null
        }
      </div>
    )
  }
}

export default Zillow
