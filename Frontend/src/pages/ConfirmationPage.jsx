import '../assets/css/ConfirmationPage.css';
import { useState, useEffect } from 'react';
import { fetchUsername, createUsername  } from '@services/authService'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';

function ConfirmationPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = location.state || {};

    const sym = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "+", "=", ";", ":", "'", "~", "[", "]", "{", "}", "|", "\"", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const chars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "+", "=", ";", ":", "'", "~", "[", "]", "{", "}", "|", "\""];

    const [username, setUsername] = useState("");
    const [isTaken, setIsTaken] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const loadUsernames = async () => {
            const { response, data } = await fetchUsername();
            if(response.ok){
                setAllUsers(data);
            }
        };
        loadUsernames();
    }, []);

    const handleChange = (e) => {
        const value = e.target.value.trim().toLowerCase();
        setUsername(value);
        const exists = allUsers.some((user) => user.username === value);
        setIsTaken(exists);
    };

    const confirmBtn = async () => {
        if (isTaken) {
            toast.error("Username already taken!");
            return;
        }

        if (!username) {
            toast.error("Username cannot be empty");
            return;
        }

        const isValid = sym.some(s => username[0] === s);
        if(isValid){
            toast.error("The first character can not be number or symbol");
            return;
        }

        const hasIt = chars.some(c => username.includes(c));
        if(hasIt){
            toast.error("Username can not contain special characters");
            return;
        }

        if(username.length < 5){
           toast.error("Username must be at least 5 character!");
           return;
        }

        try {
            const fullUser = { ...userInfo, username: username.trim().toLowerCase(), id:`${username}${Date.now()}` };
            const { response, data } = await createUsername(fullUser);

            if (response.ok) {
                localStorage.setItem("currentUser", JSON.stringify({
                id: data.id,
                username: username,
                email: data.email
                }));
                toast.success("Account created successfully!");
                navigate("/home"); 
            } 
            else {
                toast.error(data.message || "Could not create username");
            }
         } 
        catch (error) {
            toast.error(error.message);
        }
    };

    return(
        <div className={"ConfirmationPage-confirmBody"}>
            <div className={"ConfirmationPage-confirmContainer"}>
                <div>Set up your username</div>
                <input value={username} className={`${"ConfirmationPage-confirmInput"} ${isTaken ? "ConfirmationPage-confirmIsTaken" : ""}`} placeholder="Enter a username" onChange={handleChange}/>
                {isTaken && <div style={{color:"red"}}> <small>Username already taken, try another!</small></div>}
                <button className={"ConfirmationPage-confirmBtn"} onClick={confirmBtn}>Confirm</button>
            </div>
        </div>
    );
}

export default ConfirmationPage
