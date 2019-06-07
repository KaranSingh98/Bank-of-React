import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import axios from 'axios';
import Debits from './components/Debits';
import Credits from './components/Credits';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountBalance: 0.0,
            debit: [],
            credit: [],
            currentUser: {
                userName: 'bob_loblaw',
                memberSince: '08/23/99',
            }
        };
    }

    componentDidMount = () => {

        axios.get(`https://moj-api.herokuapp.com/debits`)
            .then(response => {
                const debitData = response.data;

                const debitAmount = debitData.map(debitData => debitData.amount);

                let totalDebitAmount = 0;

                for(let i = 0; i < debitAmount.length; i++)
                    totalDebitAmount += debitAmount[i];

                this.setState({
                    debit: debitData,
                    accountBalance: this.state.accountBalance - totalDebitAmount
                });
            })
            .catch(err => console.log(err));

        axios.get(`https://moj-api.herokuapp.com/credits`)
            .then(response => {
                const creditData = response.data;

                const creditAmount = creditData.map(creditData => creditData.amount);

                let totalCreditAmount = 0;

                for(let i = 0; i < creditAmount.length; i++)
                    totalCreditAmount += creditAmount[i]

                this.setState({
                    credit: creditData,
                    accountBalance: this.state.accountBalance + totalCreditAmount
                });
            })
            .catch(err => console.log(err));
    }

    todayDate = () => {

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        return today;
    }

    updateDebit = (amnt, desc) => {

        let today = this.todayDate();

        const newDebit = {
            amount: amnt,
            description: desc,
            id: this.state.debit.length,
            date: today
        };

        this.setState({
            accountBalance: this.state.accountBalance - amnt,
            // add new debit to front of the array
            debit: [newDebit].concat(this.state.debit)
        });
    }

    updateCredit = (amnt, desc) => {

        let today = this.todayDate();

        const newCredit = {
            amount: amnt,
            description: desc,
            id: this.state.credit.length,
            date: today
        };

        this.setState({

            // add new credit to front of the array
            credit: [newCredit].concat(this.state.credit),
            accountBalance: Number(this.state.accountBalance) + Number(amnt)
        });
    }

    render() {

        const HomeComponent = () => (<Home accountBalance={this.state.accountBalance}/>);

        const UserProfileComponent = () => (
            <UserProfile userName={this.state.currentUser.userName}
            memberSince={this.state.currentUser.memberSince}/>
        );

        const DebitsComponent = () => (
            <Debits addDebit={this.updateDebit} debitData={this.state.debit}
            balance={this.state.accountBalance}/>
        );

        const CreditsComponent = () => (
            <Credits addCredit={this.updateCredit} creditData={this.state.credit}
            balance={this.state.accountBalance}/>
        );

        return (
            <Router>
                <div>
                    <Route exact path="/" render={HomeComponent} />
                    <Route exact path="/userProfile" render={UserProfileComponent} />
                    <Route extact path="/debits" render={DebitsComponent} />
                    <Route exact path="/credits" render={CreditsComponent} />
                </div>
            </Router>
        );
    }
}

export default App;
