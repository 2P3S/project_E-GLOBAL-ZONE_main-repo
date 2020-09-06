import React from "react";
import ReactDOM from "react-dom";

import App from "./app/App";
import store from "./redux/store";
import { Provider } from "react-redux";

import dotenv from "dotenv";
dotenv.config();
console.log(process.env.REACT_APP_DEVELOP_MODE);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
