{/* <p>Facial Detection API</p>
<button id="apibutton" onClick={detectEmotion}>
    Detect Face!
</button> */}


function detectEmotion() {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            // authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDk4ZjIxZjQtMjU1ZC00NGViLTg0Y2YtNDFhYmY3NDNlNjRmIiwidHlwZSI6InNhbmRib3hfYXBpX3Rva2VuIn0.hpt1KzLbOR2WQxZq7abPopc0JPmTOBsjJ0W6OHh3xA4'
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDk4ZjIxZjQtMjU1ZC00NGViLTg0Y2YtNDFhYmY3NDNlNjRmIiwidHlwZSI6ImFwaV90b2tlbiJ9.c9nUrZ2-_YhRyuiUyc-jOrbBq9MivrD5mV6c0AG2CKI'
        },
        body: JSON.stringify({
            providers: 'amazon',
            response_as_dict: true,
            attributes_as_list: true,
            show_original_response: false,
            file_url: 'https://img.freepik.com/premium-photo/closeup-woman-sitting-read-book-with-bored-emotion_85347-363.jpg?w=740'
        })
    };
      
    fetch('https://api.edenai.run/v2/image/face_detection', options)
        .then(response => response.json())
        .then(response => console.log(response['amazon'].emotions[0])) //.items[0].emotions
        .catch(err => console.log(err));
    // alert(response.eden-ai.items.0.emotions)
}