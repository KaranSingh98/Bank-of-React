import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import axios from 'axios';
import Debits from './components/Debits';
import Credits from './components/Credits';

class App extends Component {

    constructor() {
        super();
        this.state = {
            accountBalance: 0,
            debits: [],
            credits: [],
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

                const debitAmount = debitData.map( debitData => debitData.amount);

                let totalDebitAmount = 0;

                for(let i = 0; i < debitAmount.length; i++)
                    totalDebitAmount += debitAmount[i];

                this.setState({
                    debits: debitData,
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

                    credits: creditData,
                    accountBalance: this.state.accountBalance + totalCreditAmount
                });

            })
            .catch(err => console.log(err));
    }

    render() {

        const HomeComponent = () => (<Home accountBalance={this.state.accountBalance}/>);
        const UserProfileComponent = () => (
            <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
        );
        const DebitsComponent = () => (<Debits debitData={this.state.debits} balance={this.state.accountBalance}/>);
        const CreditsComponent = () => (<Credits creditData={this.state.credits} balance={this.state.accountBalance}/>);
        return (
            <Router>
                <div>
                    <Route exact path="/" render={HomeComponent}/>
                    <Route exact path="/userProfile" render={UserProfileComponent} />
                    <Route extact path="/debits" render={DebitsComponent} />
                    <Route exact path="/credits" render={CreditsComponent} />
                </div>
            </Router>
        );
    }
}

export default App;
