import React, { Component } from "react";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payment_amount: 0,
      refund_id: 0,
      name:'',
      email:''
    };
    this.paymentHandler = this.paymentHandler.bind(this);
  }

  paymentHandler(e) {
    e.preventDefault();
    const { payment_amount } = this.state;
    const options = {
      key: process.env.RAZOR_PAY_TEST_KEY,
      amount: payment_amount * 100,
      name: 'Payments',
      description: 'Payments',
      handler(response) {
        const paymentId = response.razorpay_payment_id;
        const url = process.env.URL + '/api/v1/rzp_capture/' + paymentId + '/' + payment_amount;
        // Using my server endpoints to capture the payment
        fetch(url, {
          method: 'get',
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        })
          .then(resp => resp.json())
          .then(function (data) {
            console.log('Request succeeded with JSON response', data);
            self.setState({
              refund_id: response.razorpay_payment_id
            });
          })
          .catch(function (error) {
            console.log('Request failed', error);
          });
      },
      prefill: {
        name: this.state.name,
        email:this.state.email,
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  }
  render() {
    const { payment_amount } = this.state;
    return (
      <div className="wrapper">
        <form action="#" onSubmit={this.paymentHandler}>
        <input 
        type='text'
        placeholder='Full Name'
        value={this.state.name}
        onChange={e=>this.setState({name:e.target.value})}
        />
        <input 
        type='email'
        placeholder='Email Address'
        value={this.state.email}
        onChange={e=>this.setState({email:e.target.value})}
        />
          <input
            type="number"
            value={payment_amount}
            placeholder="Amount in INR"
            onChange={e => this.setState({ payment_amount: e.target.value })}
          />
          <button type="submit">Pay Now</button>
        </form>
      </div>
    );
  }
}

export default App;
