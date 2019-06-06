import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AccountBalance from './AccountBalance';

class Credits extends Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            description: ''
        };
    }

    onChange = (event) => {

        this.setState({

            [event.target.name]: event.target.value
        });
    }

    onSubmit = () => {
        this.addNewItem();
    }

    addNewItem = () => {

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return(
            <CreditView amount={this.state.amount} description={this.state.description} date={today}/>
        );
    }

    render() {
        return (
            <div className="credits">
                <title>
                    Credits
                </title>
                <Link to="/"> Home </Link>
                <h4> <AccountBalance accountBalance={this.props.balance} /> </h4>
                <h1> Credits </h1>

                <form>
                    Amount
                    <input type="number" name="amount" onChange={this.onChange}/> <br/>
                    Description
                    <input type="text" name="description" onChange={this.onChange}/> <br/>
                </form>
                <button onSubmit={this.onSubmit}> Add </button>

                {this.props.creditData.map(creditData =>
                    <div key={creditData.id}>
                        <CreditView description={creditData.description} amount={creditData.amount}
                        date={creditData.date} />
                    </div>
                )}
            </div>
        );
    }

};

class CreditView extends Component {

    render() {
        return(
            <div>
                <h3> {this.props.description} </h3>
                <p> Purchase Amount: ${this.props.amount} </p>
                <p> Date of Purchase: {this.props.date} </p>
            </div>
        );
    }
}

export default Credits;
