// import '../styles/global.css';
import '../../styles/global.css'; // Suba dois níveis para acessar a pasta styles


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;