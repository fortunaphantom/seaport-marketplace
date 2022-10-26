import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch } from "react-redux/es/exports";
import { AppDispatch, RootState } from "slices/store";
import { useEffect } from "react";
import { connectWallet, disconnectWallet } from "slices/web3Slice";
import { useSelector } from "react-redux/es/hooks/useSelector";

export default function MyAppBar() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAddress = useSelector<RootState, string>(
    (state) => state.web3.selectedAddress
  );

  useEffect(() => {}, []);

  const onConnect = () => {
    dispatch(selectedAddress ? disconnectWallet() : connectWallet());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rinzo Seaport Testing
          </Typography>
          <Button color="success" variant="contained" onClick={onConnect}>
            {selectedAddress
              ? "Connected to " + selectedAddress
              : "Connect Wallet"}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
