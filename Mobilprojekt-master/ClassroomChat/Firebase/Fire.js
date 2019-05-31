import firebase from 'firebase'
const config = {
  apiKey: 'AIzaSyBmNXELle-6jdxTZsl9Cihg18tn0Ab1D0Y',
  authDomain: 'classroomchat-35e70.firebaseapp.com',
  databaseURL: 'https://classroomchat-35e70.firebaseio.com',
  projectId: 'classroomchat-35e70',
  storageBucket: 'classroomchat-35e70.appspot.com',
  messagingSenderId: '931695887516',
  appId: '1:931695887516:web:c82e388317833c39',
}
const fire = firebase.initializeApp(config)
export default fire
