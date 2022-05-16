import "antd/dist/antd.css";
import NavBar from "../components/NavBar/NavBar";
import { AppWrapper } from "../context/state";
import "./global.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <NavBar />
      <Component {...pageProps} />
    </AppWrapper>
  );
}
