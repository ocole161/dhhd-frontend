import { useDispatch, useSelector } from "react-redux"
import SignUp from "./SignUp";
import Login from './Login'
import { logout } from "../features/userSlice";
import Button from "react-bootstrap/esm/Button";

function NavBar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        fetch('/logout',{
            method: 'DELETE',
        })
        .then(res => {
            if(res.ok){
                dispatch(logout())
            }
        })
    }

    return(
        <nav>
            <a href="/">Home</a><> </>
            {user.user_type === "admin" ? <a href="/admin">Admin</a> : null} <></>
            {user.user_type === "visitor" ? <><Login />
                <SignUp /> </>:
                <Button onClick={handleLogout}>Logout</Button>}
            <p>Current User: {user.username}</p>
        </nav>
    )
}

export default NavBar