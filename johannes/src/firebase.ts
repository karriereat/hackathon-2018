import * as firebase from 'firebase';

const config = {
  // TODO
};

firebase.initializeApp(config);

export const db = firebase.firestore();
const settings = { timestampsInSnapshots: true};
db.settings(settings);

const collection = db.collection('slideshows');

const DOCUMENT = new URL(window.location.href).searchParams.get('slideshow');

export const provider = new firebase.auth.GoogleAuthProvider();
export const slideshow = collection.doc(DOCUMENT);
export const users = db.collection('users');

export function backup() {
  slideshow.collection('slides').get().then(function(doc) {
    const json = doc.docs.map(el => el.data());
    console.log(json);
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    const $download = document.getElementById('download');
    $download.setAttribute("href", data);
    $download.setAttribute("download", "data.json");
    $download.click();
  });
};
