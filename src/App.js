import React, { Component } from "react";
import "./App.css"
import axios from "axios";



class App extends Component {
  // initializing our state
  state = {
    data: [],
    id: 0,
    title: null,
    summary:null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    idToGet:null
  };

//when the component mounts it fetches all database data into our UI
//for small amount of data should be okay
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

//killing the process when we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }



  //constantly getting info from database and rendering it
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

//getDataById=(idToGet)=>{
//  fetch("http://localhost:3001/api//getData/:id")
  //.then(data => data.json())
//  .then(res => this.setState({ data: res.data }));
//};

//adding data to database
  putDataToDB = title => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      title: title,
    //  summary:summary
    });
  };


  //using backend method to delete database info
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


//using backend method to override database info
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { title: updateToApply }
    });
  };

  //axios.get("http://localhost:3001/api//getData/:id",{
  //  .then(data => data.json())
  //  .then(res => this.setState({ data: res.data }));
  //};


  //rendering UI
  render() {
   const { data } = this.state;
   //const {summary} = this.state;
    return (


<div>
<div class="wrapper">

	<header class="header">
		<strong>Welcome to the online book marketplace</strong>
	</header>

	<div class="middle">

		<div class="container">
			<main class="content">
				<strong>List of Available Titles:</strong>
        <ul>
          {data.length <= 0
            ? "No Titles Entered For Sale"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={data.title}>
                  <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                  <span style={{ color: "gray" }}> title: </span>
                  {dat.title}

                </li>
              ))}
        </ul>
			</main>
		</div>

		<aside class="left-sidebar">
  <span>  <input
      type="text"
      onChange={e => this.setState({ title: e.target.value })}
      placeholder="add book to market"
      style={{ width: "200px" }}
      class = "css-input"
    />

    <button onClick={() => this.putDataToDB(this.state.title)} class="myButton">
      ADD
    </button> </span> <br/> <br/>
  <span>  <input
      type="text"
      style={{ width: "200px" }}
      onChange={e => this.setState({ idToDelete: e.target.value })}
      placeholder="put id of book to reserve"
      class="css-input"
    />
    <button onClick={() => this.deleteFromDB(this.state.idToDelete)} class = "myButton">
      RESERVE
    </button> </span> <br/> <br/>

    <input
      type="text"
      style={{ width: "200px" }}
      onChange={e => this.setState({ idToUpdate: e.target.value })}
      placeholder="id of book to update here"
      class="css-input"
    />
    <input
      type="text"
      style={{ width: "200px" }}
      onChange={e => this.setState({ updateToApply: e.target.value })}
      placeholder="put new title here"
      class="css-input"
    />
    <span><button
      onClick={() =>
        this.updateDB(this.state.idToUpdate, this.state.updateToApply)
      }

      class = "myButton"
    >
      UPDATE
    </button> </span> <br/> <br/>




		</aside>

	</div>

</div>

<footer class="footer">
	//<span style={{ color: "gray" }}> summary: </span> {data.summary} <br />
</footer>
</div>

);
  }
}


export default App;
