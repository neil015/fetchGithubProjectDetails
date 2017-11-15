import React from 'react';
import axios from 'axios';

let originalList = [];

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = { userName : '' , repoList : [], searchKey : ''};
        this.getSuggestedRepos = this.getSuggestedRepos.bind(this);
        this.getReposList = this.getReposList.bind(this);
        this.filterResult = this.filterResult.bind(this);
        this.clearMainText = this.clearMainText.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
    }

    clearMainText() {
        originalList =[];
        this.setState( { userName : '', repoList : [], searchKey : '' });
    }

    clearFilter() {
        this.setState({ searchKey : '', repoList : originalList });
    }

    getSuggestedRepos(userName) {
        let resposList = [];
        axios.get(`https://api.github.com/users/${userName}/repos`).then(response => {
            response.data.map(data => {
                resposList.push(data);
            });
            originalList = resposList;
            this.setState({ repoList  : resposList});
            if(originalList.length === 0 ) {
                alert("No Projects Found for given username. Please Try again");
            }
        }).catch(error => {
            throw alert("Username Doesn't exit. Please Try again");
        });
    }

    getReposList() {
        return this.state.repoList.map((list, index) => {0
            return <div key={index}>
                <a href={list.html_url} target="_blank">{ list.name }</a>
                <hr className="hr"/>
            </div>
        });
    }

    filterResult(event) {
        let filteredArray = [];
        const filterKey =  event.target.value;
        if(this.state.repoList.length < originalList.length ) {
            originalList.map(list => {
                if(list.name.toLocaleLowerCase().includes(filterKey.toLocaleLowerCase())) {
                    filteredArray.push(list);
                }
            });
        }
        else {
            this.state.repoList.map(list => {
                if(list.name.toLocaleLowerCase().includes(filterKey.toLocaleLowerCase())) {
                    filteredArray.push(list.name);
                }
            });
        }
        this.setState({ searchKey :  filterKey});
        this.setState({ repoList :  filteredArray });
    }

    render() {
        return <div className="box" >
            <div className="mainBoxBackGroundColor">
                <input  type="text" onChange = { (event) => this.setState( { userName : event.target.value })}
                        value={this.state.userName}></input>
                <button onClick={ () => this.getSuggestedRepos(this.state.userName)} >Go</button>
                <br/>
                <button onClick={this.clearMainText}>Clear</button>
            </div>
            <div>
                <input type="text" onChange={ this.filterResult } value={this.state.searchKey}
                       disabled={ this.state.repoList.length < 1 ? true : false } placeholder="Please Search for Keywords"/>
                <button type="text" onClick={ this.clearFilter}>Clear</button>
                <hr/>
                <br/><br/>
            </div>
            { this.getReposList() }
        </div>
    }
}

export default App;