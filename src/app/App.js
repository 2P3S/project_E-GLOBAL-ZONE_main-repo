import React, { Component } from "react";
import Routes from "./Routes";
import GlobalStyles from "../config/globalStyles";

/**
 * this is react class component
 * @namespace App
 * @returns {ReactDOM} App with GlobalStyles, Routes
 */
class App extends Component {

	render() {
		return (
			<>
				<GlobalStyles />
				<Routes />
			</>
		);
	}
}

export default App;
