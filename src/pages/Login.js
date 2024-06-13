import React from "react";
import { LoginAppBar } from '../components/AppBar.js';
import { Button, TextField } from '@mui/material';
import { Login } from '@mui/icons-material';
import { firestore } from "../firebase/Firebase.js"
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

// style={{backgroundColor:'#D7E2E8'}}
export default function LoginPage() {
    return (
        <body>
            <LoginAppBar/>
            <div style={{marginLeft:'50px', display:'inline-block'}}>
                <div>
                    <h2>Login</h2>
                </div>
                <div>
                    <LoginForm/>
                </div> <br/>
                <div>
                    <a href='./CreateAccount'>Create Account</a>
                </div>
            </div>
        </body>
    );
};

function LoginForm() {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [usernameError, setUsernameError] = React.useState(false)
    const [passwordError, setPasswordError] = React.useState(false)
    const navigate = useNavigate();

    const requestAuthorisation = (data) => {
        var client_id = ''; // your clientId
        var client_secret = ''; // Your secret
        var redirect_uri = 'http://localhost:3000/Work'; // Your redirect uri
        var scope = 'user-read-private user-read-email playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read';

        let url = 'https://accounts.spotify.com/authorize';
        url += "?response_type=token";
        url += "&client_id=" + encodeURIComponent(client_id);
        url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
        url += "&show_dialog=true";
        url += "&scope=" + encodeURIComponent(scope);
        url += "&state=" + data.id + '/' + data.username;
        window.location.href = url; // show Spotify's authorization screen 
    }
    
    async function checkValidity(username, password) {
        var found = false;
        // find document
        const querySnapshot = await getDocs(collection(firestore, 'test_data'));
        for (var i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            var doc_data = doc.data();
            var doc_id = doc.id;
            if (doc_data['login_details']['username']==username) {
                setUsernameError(false);
                found = true;
                if (doc_data['login_details']['password']==password) {
                    setPasswordError(false);
                    return [true, doc_id];
                }
                else {
                    setPasswordError(true);
                    return [false, doc_id];
                }
            }
        }
        if (found==false) {
            setUsernameError(true);
            return [false, ''];
        }
    };
    
    const submithandler = async (e) => {
        e.preventDefault()
        // check if password is correct
        var [valid, doc_id] = await checkValidity(username, password);
        console.log(valid);
        if (valid==true) {
            var data = {'id': doc_id, 'username':username, 'password':password}
            requestAuthorisation(data);
            // navigate('/Welcome', {state: data});
        }        
    }

    return (
        <div className="login">
            <form onSubmit={submithandler}>
                <TextField 
                    required
                    id="outlined-basic" 
                    label="Username" 
                    variant="outlined"
                    onChange={e => setUsername(e.target.value)}
                    error={usernameError}
                    helperText={
                        usernameError ? "Username does not exist. Please enter a valid username." : ""
                    }
                    value={username}
                />
                <TextField 
                    required
                    id="outlined-basic" 
                    label="Password" 
                    variant="outlined"
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    error={passwordError}
                    helperText={
                        passwordError ? "Incorrect password. Please try again." : ""
                    }
                />
                {/* <input type= "text" ref={dataRef}></input>
                <input type= "text" ref={dataRef} /> */}
                <Button type = "submit"><Login fontSize='large'/></Button>
            </form>
        </div>
    )
}

