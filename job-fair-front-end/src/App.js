import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/Register";
import CvEditor from "./components/CvEditor";
import CvBuilder from "./components/CvBuilder";



const LayoutWrapper = () => {
  return (
    <>
    <Header/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CreateCV" element={<CvEditor/>}/>
        <Route path="/listTemplateCV" element={<CvBuilder/>} />
        <Route path="/" element={<Home />} />

      </Routes>
      <Footer/>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
};

export default App;
