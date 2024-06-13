import React from "react";
import MultiSelect from '../components/MultiSelectPreference.js';
import { LoginAppBar } from '../components/AppBar.js';
import { Button } from '@mui/material';
import { addDocumentField } from '../firebase/SubmitData.js';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/Firebase.js"

const params = new URLSearchParams(window.location.hash.substring(1));
var access_token = params.get("access_token");

export default function Welcome(props) {
    const params = new URLSearchParams(window.location.hash);
    var state = params.get("state").split('/');
    var username = state[1];
    var id = state[0];

    return (
        <body>
            <LoginAppBar/>
            <div style={{margin: '25px'}}>
                <div><strong>Hi {username}, please select your music preferences!</strong></div>
                <br/>
                <PreferenceForm doc_id={id} username={username}/>
            </div>
        </body>
    )
}

function PreferenceForm(props) {
    const {doc_id, username} = props
    const [value1, setValue1] = React.useState('happy'); // happy
    const [value2, setValue2] = React.useState('sad'); // sad
    const [value3, setValue3] = React.useState('calm'); // concentrating
    const [value4, setValue4] = React.useState('calm'); // stressed
    const [value5, setValue5] = React.useState('angry'); // angry
    const [value6, setValue6] = React.useState('happy'); // bored
    var selectionList = ['angry','calm','happy','sad']

    const redirect = () => {
        window.location.href = "./Work#access_token=" + access_token + "&state=" + doc_id + '/' + username;
    }

    const submithandler = async (e) => {
        e.preventDefault()
        var data = {'happy': value1, 'sad': value2, 'concentrating': value3, 'stressed': value4, 'angry': value5, 'bored': value6};
        await addDocumentField("test_data", data, 'user_preferences', doc_id);
        console.log("User Preferences Saved!");
        window.location.href = "./Work#access_token=" + access_token + "&state=" + doc_id + '/' + username;
    }

    return (
        <body>
            <div className="login">
                <form onSubmit={submithandler}>
                    <MultiSelect 
                        title="What type of music do you listen to when you are happy?"
                        selectionList={selectionList}
                        value={value1}
                        setValue={(e)=>setValue1(e)}
                    />
                    <MultiSelect 
                        title="What type of music do you listen to when you are sad?"
                        selectionList={selectionList}
                        value={value2}
                        setValue={(e)=>setValue2(e)}
                    />
                    <MultiSelect 
                        title="What type of music do you listen to when you are concentrating?"
                        selectionList={selectionList}
                        value={value3}
                        setValue={(e)=>setValue3(e)}
                    />
                    <MultiSelect 
                        title="What type of music do you listen to when you are stressed?"
                        selectionList={selectionList}
                        value={value4}
                        setValue={(e)=>setValue4(e)}
                    />
                    <MultiSelect 
                        title="What type of music do you listen to when you are angry?"
                        selectionList={selectionList}
                        value={value5}
                        setValue={(e)=>setValue5(e)}
                    />
                    <MultiSelect 
                        title="What type of music do you listen to when you are bored?"
                        selectionList={selectionList}
                        value={value6}
                        setValue={(e)=>setValue6(e)}
                    />
                    <Button type = "submit">Save Preferences</Button>
                </form>
            </div>
        </body>
    )
}