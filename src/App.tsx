import React from "react";
import Home from "pages/Home";
import MyAppBar from "components/MyAppBar";
import "styles/app.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "slices/store";
import Loader from "components/Loader";

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", "Urbanist"].join(","),
  },
});

function App() {
  const loading = useSelector<RootState, boolean>(
    (state) => state.viewState.loading
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <MyAppBar />
        <Home />
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {loading && <Loader />}
      </div>
    </ThemeProvider>
  );
}

export default App;
