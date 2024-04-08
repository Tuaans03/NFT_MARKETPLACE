const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const respone = require('../utils/response');
const {userService} = require('../services');

const uploadImage = (req,res) =>{
    if(req.files){
        const avatar= req.files.avatar;
        const cmndImg = req.files.cmndImg;
        const insuranceImg = req.files.insuranceImg;

        if(avatar){
            req.body.avatar = avatar[0].path;
        }
        if(cmndImg){
            req.body.cmndImg = cmndImg[0].path;
        }
        if(insuranceImg){
            req.body.insuranceImg = insuranceImg[0].path
        }
    }
}

const createUser = catchAsync( async(req,res) =>{
    uploadImage(req,res);
    const user = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).join(respone(httpStatus.CREATED,'Tạo mới người dùng thành công',user))
})

const getUsers = catchAsync( async(req,res) =>{
    const result = await userService.queryUsers(req.query);
    res.status(httpStatus.OK).json(respone(httpStatus.OK,'thành công',result));
})

const getUser = catchAsync( async(req,res)=>{
    const result = await userService.getUserById(req.params.userId || req.user.id);
    if(!user){
        throw new ApiError(httpStatus.NOT_FOUND,'Người dùng không tồn tại');
    }
    res.status(httpStatus.OK).json(respone(httpStatus.OK,'Thành công',result));
})


const updateUser = catchAsync( async(req,res) =>{
    uploadImage(req,res);
    const user =await userService.updateUserById(req.params.userId ,req.body);
    res.status(httpStatus.OK).json(respone(httpStatus.OK,'Thành công',user));
})

const deleteUser = catchAsync( async(req,res) =>{
    const user = await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.OK).json(respone(httpStatus.OK,'Xóa thành công người dùng',user))
})

const updateProfile = catchAsync( async(req,res) =>{
    uploadImage(req,res);
    const user = await userService.updateUserById(req.params.userId,req.body);
    res.status(httpStatus.OK).json(respone(httpStatus.OK,'Thành công'),user);
})

const lockUser = catchAsync( async(req,res) =>{
    const user = await userService.lockUserById(req.params.userId);
    res.status(httpStatus.OK).json(respone(httpStatus.OK),'Thành công',user);
})

module.exports ={
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    lockUser,
    updateProfile
}