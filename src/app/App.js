import React, { Component } from "react";
import Routes from "./Routes";
import GlobalStyles from "../config/globalStyles";

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
