import express from 'express';
import Order from './../models/Order.js';

const router = express.Router();

router.get('/', async (req,res) => {
    //sort -1 = descending (datecreated new til old)
    //                     (orderscription Z -A )
    //sort 1 = ascending (dateCreated old til new)
    //                   (orderdescription A - Z)
    const orders = await Order.find().populate('user').sort({dateCreated:1})
    return res.status(200).json(orders);
});
//Get the order by userID
router.get('/byuser/:userid', async (req, res) => {
    const orders = await Order.find({user:req.params.userid}).populate('user')
    return res.status(200).json(orders);
})
//http://localhost:3001/api/orders/paging?page=1&pageSize=2
//using paging 
router.get('/paging', async(req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10
    
    //example page = 2 & pageSize = 3 
    //(2 -1) = 1 * 3 = skip(3)
    //example page = 3 & pageSize = 3
    //(3 -1) = 2 * 3 = skip(6)
    const skipRows = (page - 1) * pageSize;
    const orders = await Order.find().populate('user').skip(skipRows).limit(pageSize)

    return res.status(200).json(orders);
});

router.post('/add', async (req, res) => {
    try {
        const resultOrder = await Order.create({
            orderDescription:req.body.orderDescription,
            totalPrice:req.body.totalPrice,
            vat:req.body.vat,
            totalPriceInclVat: req.body.totalPriceInclVat,
            user: req.body.userID
        })

        return res.status(201).json({message:'Order was created', createdOrder:resultOrder});

    } catch (error) {
        return res.status(400).json({message:'Error happened', error:error.toString()});
        
    }
});

export default router;