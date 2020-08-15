import React, { Component } from "react";
import Routes from "./Routes";

/**
 * this is react class component
 * @namespace App
 * @returns {ReactDOM} App with GlobalStyles, Routes
 */
class App extends Component {
	componentDidMount() {
		fetch("http://13.124.189.186:8888/api/department").then((res) =>
			res.json().then((json) => console.log(json))
		);
	}
	render() {
		return (
			<>
				<Routes />
			</>
		);
	}
}

export default App;
