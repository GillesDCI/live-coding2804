import express from 'express';
import User from './../models/User.js';


const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find()

    return res.status(200).json(users);
})

//creating a new user 
router.post('/add',async (req, res) => {
    try {
        const userToAdd = new User({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            username:req.body.username
        })

        //alternative way of creating a user.
        const resultUser = await userToAdd.save();

        return res.status(200).json({message:'User was created', createdUser:resultUser})
    } catch (error) {
        return res.status(400).json({message:'Error happened', error:error})
    }
});


export default router;