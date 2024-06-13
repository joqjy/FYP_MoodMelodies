import { addDoc, collection } from "@firebase/firestore"
import { firestore } from "./Firebase.js"
import {doc, updateDoc} from "firebase/firestore";
 
function addFirebaseDocument(collection_name, data_dict, field_name) {
    const ref = collection(firestore, collection_name) // Firebase creates this automatically
    let data = {
        [field_name]: data_dict
    }
    try {
        var doc_ref = addDoc(ref, data)
        return doc_ref
    } catch (err) {
        console.log(err)
    }
}

async function addDocumentField(collection_name, data_dict, field_name, doc_id) {
    var docRef = doc(firestore, collection_name, doc_id);
    await updateDoc(docRef, {
        [field_name]: data_dict
    })
}
 
export { addFirebaseDocument, addDocumentField }