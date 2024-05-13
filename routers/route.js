const express = require('express');
const router = express.Router();


const {createNewUser, logIn} = require('../controllers/user');
const {auth} = require('../middleWares/auth');
const { addPendingTask } = require('../controllers/addTask');
const { addCompletedTask } = require('../controllers/completedTask');

router.post('/create/user', createNewUser);
router.post('/login', logIn);
router.post('/pendingTask/add', addPendingTask);
router.post('/completedTask', addCompletedTask)

router.get('/user', auth, (req, res) => {
    res.status(200).json({
        sucess:true,
        message:"user already loggedin"
    })
})


module.exports = router;