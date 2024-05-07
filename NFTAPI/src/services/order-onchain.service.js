const {OrderOnChain,MakeOfferOnchain} = require('../models');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createOrderOnchain = async(orderOnchainBody) =>{
    const {contractAddress,tokenId,seller,isErc721} = orderOnchainBody;
    const query = {contractAddress,tokenId};
    if(!isErc721) query.seller = seller;
    const orderOnchains = await OrderOnChain.find(query);
    orderOnchainBody.listingId = orderOnchains.lenth;
    return OrderOnChain.create(orderOnchainBody);
}

const queryOrderOnchains = async (orderOnchainQuery) =>{
    const filter = pick(orderOnchainQuery,[]);
    const options = pick(orderOnchainQuery,['sortBy','limit','page','populate']);
    const orderOnchains = await OrderOnChain.paginate(filter,options);
    return orderOnchains;
}

const getOrderOnchainById = async(id) =>{
    return OrderOnChain.findById(id);
}

const updateOrderOnchainById = async( orderOnchainId,updateBody) =>{
    const orderOnchain = await getOrderOnchainById(orderOnchainId);
    if(!orderOnchain){
        throw new ApiError(httpStatus.NOT_FOUND,'OrderOnchain not found');
    }
    Object.assign(orderOnchain,updateBody);
    await orderOnchain.save();
    return orderOnchain;
}

const endOrderOnchain = async(contractAddress, tokenId , seller, isErc721,status) =>{
    const query = {contractAddress,tokenId,status:'listed'};
    if(!isErc721) query.seller = seller;
    const orderOnchain = await OrderOnChain.findOne(query);
    if(!OrderOnChain){
        throw new ApiError(httpStatus.NOT_FOUND,'OrderOnchain not found');
    }
    if(status === 'claimed'){
        const makeOfferOnchain = MakeOfferOnchain.findOne({orderOnchain:orderOnchain._id, status:'accepted'});
        if(!makeOfferOnchain){
            throw new ApiError(httpStatus.NOT_FOUND,"Make Offer Onchain not found");
        }
        makeOfferOnchain.isClaimed= true;
        await makeOfferOnchain.save();
    }
    else{
        orderOnchain.status = status;
        await orderOnchain.save();
    }
}

const deleteOrderOnchainById = async(orderOnchainId) =>{
    const orderOnchain = await getOrderOnchainById(orderOnchainId);
    if(!orderOnchain){
        throw new ApiError(httpStatus.NOT_FOUND,'OrderOnchain not found');
    }
    await orderOnchain.deleteOne();
    return orderOnchain;
}

module.exports = {
    createOrderOnchain,
    queryOrderOnchains,
    getOrderOnchainById,
    updateOrderOnchainById,
    endOrderOnchain,
    deleteOrderOnchainById
}