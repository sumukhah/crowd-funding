import "antd/dist/antd.css";
import { useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import { AppWrapper } from "../context/state";
import "./global.css";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
    } else {
    }
  }, []);
  return (
    <AppWrapper>
      <NavBar />
      <Component {...pageProps} />
    </AppWrapper>
  );
}
