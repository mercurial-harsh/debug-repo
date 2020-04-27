const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');




const {
    getAlliots,
    getOneiot,
    postOneiot,
    deleteiot,
    editiot
} = require('./APIs/iots')

const { 
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails
} = require('./APIs/users')

// iots
app.get('/iots', auth, getAlliots);
app.get('/iot/:iotId', auth, getOneiot);
app.post('/iot',auth, postOneiot);
app.delete('/iot/:iotId',auth, deleteiot);
app.put('/iot/:iotId',auth, editiot);

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth ,uploadProfilePhoto);
app.post('/user', auth ,updateUserDetails);
app.get('/user', auth, getUserDetail);

exports.api = functions.https.onRequest(app);
