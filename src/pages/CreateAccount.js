import React from "react";
import { addFirebaseDocument, addDocumentField } from '../firebase/SubmitData.js';
import { Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { LoginAppBar } from '../components/AppBar.js';
import { useNavigate } from 'react-router-dom';
import { firestore } from "../firebase/Firebase.js"
import { collection, getDocs } from "firebase/firestore";

// style={{backgroundColor:'#D7E2E8'}}
export default function AccountCreation() {
    return (
        <div>
            <LoginAppBar/>
            <div style={{marginLeft:'50px'}}>
                <h2>Create Account</h2>
                <AccountCreationForm/>
            </div>
        </div>
    );
};


function AccountCreationForm() {
    const [name, setName] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [usernameError, setUsernameError] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const navigate = useNavigate();

    const requestAuthorisation = (data, doc_id) => {
        var client_id = '' // your clientId
        var client_secret = '' // Your secret
        var redirect_uri = 'http://localhost:3000/Welcome'; // Your redirect uri
        var scope = 'user-read-private user-read-email playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read';

        let url = 'https://accounts.spotify.com/authorize';
        url += "?client_id=" + encodeURIComponent(client_id);
        url += "&response_type=token";
        url += "&redirect_uri=" + encodeURI(redirect_uri);
        url += "&show_dialog=true";
        url += "&scope=" + encodeURIComponent(scope);
        url += "&state=" + doc_id + '/' + data.username;
        window.location.href = url; // show Spotify's authorization screen 
    }

    async function checkUsernameValidity(username) {
        // find document
        const querySnapshot = await getDocs(collection(firestore, 'test_data'));
        for (var i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            var doc_data = doc.data();
            var doc_id = doc.id;
            if (doc_data['login_details']['username']==username) {
                setUsernameError(true);
                return false;
            }
        }
        return true; // no duplicates
    };
 
    const submithandler = async (e) => {
        e.preventDefault()
        var valid = await checkUsernameValidity(username);
        console.log(valid)
        if (valid){
            var data = {'name':name, 'username':username, 'password':password}
            var doc_ref = await addFirebaseDocument("test_data", data, 'login_details')
            addDocumentField("test_data", '', "emotion", doc_ref.id)
            addDocumentField("test_data", '', "playlist", doc_ref.id)
            console.log("Account Created!");
            requestAuthorisation(data, doc_ref.id);
            // window.location.href = "./Welcome/" + username
            // navigate('/Welcome', {state: data});
        }
    }

    return (
        <div className="createaccount">
            <form onSubmit={submithandler}>
                <TextField 
                    required
                    id="outlined-basic" 
                    label="Name" 
                    variant="outlined"
                    onChange={e => setName(e.target.value)}
                    value={name}
                />
                <br/><br/>
                <TextField 
                    required
                    id="outlined-basic" 
                    label="Username" 
                    variant="outlined"
                    error={usernameError}
                    helperText={
                        usernameError ? "Username already taken." : ""
                    }
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                />
                <br/><br/>
                <TextField 
                    required
                    id="outlined-basic" 
                    label="Password" 
                    variant="outlined"
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                />
                <br/><br/>
                <FormControlLabel 
                    required 
                    control={<Checkbox />} 
                    label="I own a Spotify Premium Account." 
                />
                <p>Note: Please create a Spotify Premium Account if you do not own one!</p>
                <Button type = "submit">Submit</Button>
            </form>
        </div>
    )
}