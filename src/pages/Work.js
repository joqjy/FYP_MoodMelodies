import React from "react";
import { Buffer } from "buffer";
import { CameraAlertDialog, RedirectAlertDialog } from '../components/Dialog.js';
import { HomeAppBar } from '../components/AppBar.js';
import { firestore } from "../firebase/Firebase.js"
import { doc, collection, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { IconButton } from '@mui/material';
import { Tune, SentimentSatisfiedAlt, SentimentVeryDissatisfied, SentimentSatisfied, SentimentDissatisfied, MoodBad } from '@mui/icons-material';

window.Buffer = Buffer;
const Rekognition = require("aws-sdk");
const WebCamera = require("webcamjs");
const intervalTime = 120000;
var nIntervalId;
var docRef;

const params = new URLSearchParams(window.location.hash.substring(1));
var access_token = params.get("access_token");
console.log(access_token);

export default function Work() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    console.log(params);
    var state = params.get("state").split('/');
    var username = state[1];
    var id = state[0];
    
    docRef = doc(firestore, "test_data", id);

    const handleSettings = () => {
        window.location.href = "./Welcome#access_token" + access_token + "&state=" + id + '/' + username 
    }

    const handleLogout = () => {
        window.location.href = './Login'
    }

    return (
        <div>
            <HomeAppBar handleLogout={handleLogout}/>
            <div style={{margin: '25px'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <h2>Hi {username}!</h2>
                    <div>
                        <IconButton aria-label="settings" onClick={handleSettings}>
                            <Tune fontSize='large'/>
                        </IconButton>
                    </div>
                </div>
                <div id='playlist'><SpotifyEmbed/></div>
                <div id="camdemo" style={{height: "1px", width:"1px", textAlign:"center", margin:"0"}}></div>
                <CameraAlertDialog 
                    title='Allow Camera Permissions?' 
                    contentText='This application requires your device camera to work.' 
                    label1='Deny' 
                    label2='Allow'
                    setDeny={ async () => {
                        console.log("Camera permissions denied");
                        await handleStartCam(false);
                    }}
                    setAllow={ async () => {
                        console.log("Camera permissions enabled");
                        WebCamera.set({
                            // live preview size
                            width: 320,
                            height: 240,

                            // device capture size
                            dest_width: 640,
                            dest_height: 480,

                            // format and quality
                            image_format: 'jpeg',
                            jpeg_quality: 100,
                        });
                        await handleStartCam(true);
                    }}
                />
            </div>
        </div>
    )
}

async function handleStartCam(allow) {
    if (allow) {
        WebCamera.attach('#camdemo');
        console.log("The camera has been started");
        await updateDoc(docRef, {emotion: ''})
        snapPic();
        nIntervalId = setInterval(snapPic, intervalTime);
    }
    else { // disabled permissions
        clearInterval(nIntervalId);
        WebCamera.reset();
        console.log("The camera has been disabled");
        await updateDoc(docRef, {emotion: ''})
    }
} 

function snapPic() {
    setTimeout(()=>{
        WebCamera.snap((data_uri) => {
            // Save the image in a variable
            var imageBuffer = processBase64Image(data_uri);
            window.myFS.writeFile('emotionImg.jpeg', imageBuffer.data);
            console.log("Capture saved successfully!")
        });
        setTimeout(()=>{
            detectEmotion();
        },1000); // wait 1s before executing facial detection
    },2000); // ensures enough time for webcam to start
}

function processBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');
    return response;
}

async function detectEmotion() {
    // const emotionDesc = document.getElementById('emotionDesc');
    var filePath = await window.myFS.readFile('emotionImg.jpeg');
    console.log(filePath);

    const rekognition = new Rekognition.Rekognition({
        region: '', // your region (should be ap-southeast-1)
        accessKeyId: '', // your access ID
        secretAccessKey: '' // your secret access key
    });

    rekognition.detectFaces({
        Attributes: ["ALL"],
        Image: {
            Bytes: filePath
        }
    }, async (err, data) => {
        if (err) {
            console.log(err,err.stack);
        } else {
            console.log(data);
            if (data.FaceDetails.length != 0) { 
                // emotionDesc.innerText = data.FaceDetails[0].Emotions[0].Type
                if (data.FaceDetails[0].Emotions[0].Confidence >= 75.0) {
                    var songList = await obtainRecommendationMusic(data.FaceDetails[0].Emotions[0].Type);
                    await createPlaylist(songList);
                    // save emotion to firebase
                    await updateDoc(docRef, {
                        emotion: data.FaceDetails[0].Emotions[0].Type,
                    });
                }
                else {
                    await updateDoc(docRef, {emotion: ''})
                }
            }
            else {
                await updateDoc(docRef, {emotion: ''})
            }
        }
    })
}

async function createPlaylist(songList) {
    // create playlist
    var playlist;
    await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "POST", 
        headers: { Authorization: `Bearer ${access_token}` },
        body: JSON.stringify({ name: 'MoodMelodies Playlist'})
    }).then(r => r.json())
    .then(r => {
        playlist = r.id;
        updateDoc(docRef, {playlist: r.id});
    })
    .then(r => {
        // add music to playlist
        fetch(`https://api.spotify.com/v1/playlists/${playlist}/tracks`, {
            method: "POST", 
            headers: { Authorization: `Bearer ${access_token}` },
            body: JSON.stringify({uris: songList})
        }).then(x => x.json())
        .then(x => console.log(x));
    });
}

async function obtainRecommendationMusic(emotion) {
    var songList = []
    console.log("user emotion: " + emotion.toLowerCase());
    // map emotion to user preference
    const emotion_mapper = {'HAPPY':'happy', 'SAD':'sad', 'FEAR':'stressed', 'CALM':'bored', 'CONFUSED':'concentrated', 'ANGRY':'angry', 'DISGUSTED':'stressed', 'SURPRISED':'happy'}
    const docSnap = await getDoc(docRef);
    var user_data = docSnap.data();    
    var user_pref = user_data['user_preferences'][emotion_mapper[emotion]];
    console.log("user_pref: " + user_pref);

    // access song_database
    const querySnapshot = await getDocs(collection(firestore, 'song_database'));
    var count = 0;
    for (var i in querySnapshot.docs) {
        const doc = querySnapshot.docs[i];
        var doc_data = doc.data();
        // check if song mood label is equivalent to user's preference
        if (doc_data['mood']==user_pref & count < 30) {
            // check if song is in user's liked songs
            await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${doc_data['track_uri'].split(':')[2]}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${access_token}`},
            }).then(r => r.json())
            .then(r => {
                if (r[0]==true){
                    songList.push(doc_data['track_uri']);
                    count += 1;
                }
                // if not in liked songs, then check confidence score
                else if (doc_data['score']>=0.75){
                    songList.push(doc_data['track_uri']);
                    count += 1;
                }
            });
        }
    }
    console.log(songList);
    return songList;
}

function SpotifyEmbed() {
    const [prompt, setPrompt] = React.useState(<div/>);
    const [redirect, setRedirect] = React.useState(<div/>);
    const [emotion, setEmotion] = React.useState('');
    const emoticon = {'HAPPY':<SentimentSatisfiedAlt/>, 'SAD':<SentimentVeryDissatisfied/>, 'FEAR':<SentimentVeryDissatisfied/>, 'CALM':<SentimentSatisfied/>, 'CONFUSED':<SentimentDissatisfied/>, 'ANGRY':<MoodBad/>, 'DISGUSTED':<MoodBad/>, 'SURPRISED':<SentimentSatisfiedAlt/>}

    const getDocSnap = async () => {
        const docSnap = await getDoc(docRef);
        var doc_data = docSnap.data();
        var playlist_uri = doc_data.playlist;
        if ((doc_data.emotion != emotion) && (doc_data.emotion != '')){
            setPrompt(<RedirectAlertDialog
                    title='Redirect to Spotify?'
                    contentText='We spotted a change in Emotion and have a new playlist for you!' 
                    label1='No'
                    label2='Take me to Spotify!'
                    setDeny={() => {
                        console.log("Spotify redirect denied");
                        setPrompt(<div/>)
                    }}
                    setAllow={() => {
                        console.log("Redirecting to Spotify...");
                        var full_uri = `spotify:playlist:${playlist_uri}`
                        setPrompt(<iframe src={full_uri} style={{display:'none'}}></iframe>);
                    }}
                />
            );
        }
        else {
            setPrompt(<div/>);
        }
        return doc_data.emotion;
    }
    
    let sIntervalId;
    React.useEffect(() => {
        sIntervalId = setInterval(()=> {
            getDocSnap().then(x=>setEmotion(x));
        }, 5000);
        return () => clearInterval(sIntervalId);
    });


    return (
        <div>
            <div style={{display:'flex'}}>
                <p>You are currently feeling: &ensp;</p>
                <div style={{alignSelf:'center'}}>{emoticon[emotion]} {emotion}</div>
                {prompt}
            </div>
            <div> {redirect} </div>
        </div>
    );
}

