import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function Login() {
    const dispatch = useDispatch();

    // States for open/close Popup
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const [errors, setErrors] = useState(null);
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const {username, password} = formData;

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
      }

    function onSubmit(e) {
        e.preventDefault()
        const user = {
            username,
            password,
        }
        
        fetch('/login',{
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify(user)
        })
        .then(res => {
            if(res.ok){
                res.json().then(user => {
                    dispatch(login(user))
                    setErrors(null)
                    closeModal()
                })
                .catch((error) => {
                    console.error("Error:", error);
                  });
            } else {
                res.json().then(json => setErrors(json.error))
            }
        })
    }

    return (
        <>
        <Button onClick={() => setOpen(o => !o)}>Login</Button>
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <h1>Login</h1>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username: </Form.Label>
                    <Form.Control type="text" name="username" placeholder="Enter your username" value={username} onChange={handleChange} required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password: </Form.Label>
                    <Form.Control type="password" name="password" placeholder='Password' value={password} onChange={handleChange} required/>
                </Form.Group>
                <Button variant="primary" type="submit">Login</Button>
                {errors ? <Alert variant="warning">{errors}</Alert> : null}
            </Form>
        </Popup >
        </>
    )
}

export default Login