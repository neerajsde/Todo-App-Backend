const express = require('express');
const router = express.Router();


const {createNewUser, logIn} = require('../controllers/user');
const {auth} = require('../middleWares/auth');
const { addPendingTask } = require('../controllers/addTask');
const { addCompletedTask } = require('../controllers/completedTask');
const {deleteTask} = require('../controllers/deleteTask');
const {editTask} = require('../controllers/editTask');
const {sendOTP} = require('../controllers/sendOTP');
const {changePass} = require('../controllers/changePass');

router.post('/create/user', createNewUser);
router.post('/login', logIn);
router.post('/pendingTask/add', addPendingTask);
router.post('/completedTask', addCompletedTask);
router.delete('/deleteTask', deleteTask);
router.put('/editTask', editTask);
router.post('/send-otp', sendOTP);
router.post('/update-password', changePass);

router.get('/user', auth, logIn);


module.exports = router;