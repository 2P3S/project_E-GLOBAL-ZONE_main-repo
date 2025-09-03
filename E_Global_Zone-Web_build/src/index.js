import React from "react";
import ReactDOM from "react-dom";

import App from "./app/App";
import store from "./redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import dotenv from "dotenv";
dotenv.config();

ReactDOM.render(
	<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
		<React.StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		</React.StrictMode>
	</GoogleOAuthProvider>,
	document.getElementById("root")
);
