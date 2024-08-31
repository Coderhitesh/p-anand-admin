import './App.css';
import { BrowserRouter} from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard';
// import Home from './Components/Home/Home';
import Home from './components/Home/Home'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
        <BrowserRouter>
          {/* <Home/> */}
          <Home />
          <ToastContainer/>
        </BrowserRouter>
    </>
  );
}

export default App;
