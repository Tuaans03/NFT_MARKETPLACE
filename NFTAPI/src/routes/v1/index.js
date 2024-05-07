const express = require('express');
const router = express.Router();

const userRoute = require('./user.role');
const authRoute = require('./auth.route');
const roleRouter = require('./role.route');


const routes = [
    {
        path: './users',
        route: userRoute
    },
    {
        path: './path',
        route:  roleRouter
    },
    {
        path:'./role',
        route: authRoute
    }
]

routes.forEach((route) =>{
    router.use(route.path,route.route);
});

module.exports = router;
