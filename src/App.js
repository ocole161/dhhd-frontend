import './App.css';
import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import NavBar from './components/NavBar';
import Home from './components/Home';
import Admin from './components/Admin';
import SpecialView from './components/SpecialView';
import { login, logout } from './features/userSlice';
import { setSpecials } from './features/specialsSlice';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

function App() {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState(null)
  const specials = useSelector((state) => state.specials);
  const user = useSelector((state) => state.user);
  
  const neighborhoods = [
    "Arvada", 
    "Aurora", 
    "Broomfield", 
    "Cap Hill", 
    "Central Downtown", 
    "Cherry Creek", 
    "DTC", 
    "East Colfax", 
    "Five Points", 
    "Golden", 
    "Hilands", 
    "Lakewood", 
    "Littleton", 
    "LoDo", 
    "LoHi", 
    "North Denver", 
    "Northfield", 
    "Parker",
    "RiNo",
    "Santa Fe", 
    "South Broadway", 
    "Thornton", 
    "University", 
    "Uptown", 
    "Wash Park", 
    "West Denver", 
    "Westminster", 
    "Wheat Ridge"
  ]
  const times = [ '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM',  '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',  '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM']

  useEffect(() => {
    console.log('useEffect called')
    fetch('/authorized')
    console.log('fetch called')
    .then(res => {
      console.log(res)
      if(res.ok){
        res.json().then(user => {
          console.log(user)
          if(user){
            dispatch(login({
              username: user.username,
              user_type: user.user_type,
              id: user.id,
            }))
            console.log(user)
          }else {
            dispatch(logout());
            console.log(user)
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      } else {
        res.json().then(json => setErrors(json.error))
        console.log(errors)
      }
    })
  },[dispatch])

  useEffect(() => {
    fetch("/specials")
    .then(res => res.json())
    .then(data => {
        dispatch(setSpecials(data),
        console.log(data))
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }, [dispatch])

  // Show spinner if specials or user haven't loaded yet
  if (specials[0] === undefined || user.username === null) {
    return (
      <>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>

      </Spinner>
      {errors ? <Alert variant="warning" >{errors}</Alert> : null}
      </>
    );
  } 

  return (
    <BrowserRouter>
      <NavBar />
      {errors ? <Alert variant="warning" >{errors}</Alert> : null}
      <Routes>
            <Route path="/" element={<Home neighborhoods={neighborhoods} times={times} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/specials/:id" element={<SpecialView neighborhoods={neighborhoods} times={times} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;