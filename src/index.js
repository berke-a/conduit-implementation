import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactValidatableFormProvider } from "react-validatable-form";
import "./input.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { store } from "./store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
let persistor = persistStore(store);

root.render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<BrowserRouter>
				<SnackbarProvider
					hideIconVariant
					maxSnack={3}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
				>
					<ReactValidatableFormProvider>
						<App />
					</ReactValidatableFormProvider>
				</SnackbarProvider>
			</BrowserRouter>
		</PersistGate>
	</Provider>
);
