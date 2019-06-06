import React, {Component} from 'react';

class AccountBalance extends Component {

  render() {
    return (
        <div>
          Account Balance: ${this.props.accountBalance.toFixed(2)}
        </div>
    );
  }
}

export default AccountBalance;
