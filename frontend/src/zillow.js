import React, {Component} from 'react'
import clientAuth from './clientAuth.js'
import './zillow.css'
var ReactBootstrap = require('react-bootstrap')
var Modal = ReactBootstrap.Modal

class Zillow extends Component {

  constructor(){
    super()

    this.state = {
      quotes: null,
      isModalOpen: false
    }
    //this._toggleModal = this._toggleModal.bind(this)
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

    this.props.onSearch(locationData)
  }

  _addQuote(evt){
    evt.preventDefault()
    const newQuote = {
      street: this.props.data.address.street,
      city: this.props.data.address.city,
      state: this.props.data.address.state,
      zestimate: this.props.data.zestimate.amount['$t'],
      useCode: this.props.data.useCode,
      beds: this.props.data.bedrooms,
      baths: this.props.data.bathrooms,
      sqft: this.props.data.finishedSqFt
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
        <h1 id="get-info">Get Property Info</h1>
        <form className="form-inline" onSubmit={this._newSearch.bind(this)}>
          <div className="form-group" id="address">
            <label>Enter Address</label>
            <input className="form-control" type='text' placeholder='Street Address' ref='address' id="zillow" />
          </div>
          <div className="form-group" id="citystatezip">
            <label>Enter City/State or Zip code</label>
            <input className="form-control" type='text' placeholder='Ex... New York, NY or 11101' ref='citystatezip' id="zillow" />
          </div>

          <button className="btn" type='submit'>Search</button>
        </form>

        {listing
          ? (
            <div className="static-modal">
            <Modal show={!!this.props.data} onHide={this.props.onDismissModal}>
              <Modal.Header closeButton>
                <Modal.Title id="title">Property Data</Modal.Title>
              </Modal.Header>
                {/* <button onClick={() => this.closeModal()}>X</button> */}
                <Modal.Body>
                <div className='listing'>
                  <p><strong>City:</strong> {listing.address.city}</p>
                  <p><strong>State:</strong> {listing.address.state}</p>
                  <p><strong>Street:</strong> {listing.address.street}</p>
                  <p><strong>Zipcode:</strong> {listing.address.zipcode}</p>
                  <p><i>{listing.useCode}</i></p>
                  <p><strong>Address:</strong> {listing.address.street}, {listing.address.city}, {listing.address.state}</p>
                  <div className="table-responsive">
                          <div className="details"><p>{listing.finishedSqFt} Sq.ft</p></div>
                          <div className="details"><p>{listing.bedrooms} Beds</p></div>
                          <div className="details"><p>{listing.bathrooms} Baths</p></div>
                  </div>

                  <h3>Your home is worth:</h3>
                  <h2 className="amount">${listing.zestimate.amount['$t'][0]},{listing.zestimate.amount['$t'][1]}{listing.zestimate.amount['$t'][2]}{listing.zestimate.amount['$t'][3]},{listing.zestimate.amount['$t'][4]}{listing.zestimate.amount['$t'][5]}{listing.zestimate.amount['$t'][6]}</h2>
                  <Modal.Footer>
                    <button className="btn btn-danger" id="save" onClick={this._addQuote.bind(this)}>Save Quote</button>
                  </Modal.Footer>
                </div>
                </Modal.Body>
              </Modal>
            </div>
              )
              : null
            }
      </div>

    )
  }
}

export default Zillow
