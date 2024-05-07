const {BuyOnChain,NftOnchain} = require('../models');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createBuyOnchain = async (buyOnChainBody) =>{
    const {contractAddress,tokenId, ...newBuyonchainBody} = buyOnchainBody;
    const nftOnchain =  await NftOnchain.findOne({contractAddress,tokenId});
    if(!nftOnchain){
        throw new ApiError(httpStatus.NOT_FOUND,'NftOnchain not found');
    }
    Object.assign(newBuyonchainBody, {nftOnchain:nftOnchain._id});
    return BuyOnChain.create(newBuyonchainBody);
}


const queryBuyOnchains = async(buyOnchainQuery) =>{
    const filter = pick(buyOnchainQuery,[]);
    const options = pick(buyOnchainQuery,['sortBy','limit','page','populate']);
    const buyOnchains = await BuyOnChain.paginate(filter,options);
    return buyOnchains;
}

const getBuyOnchainById = async(id) =>{
    return BuyOnChain.findById(id);
}

const updateBuyAuctionOnchainById = async (buyOnchainId,updateBody) =>{
    const buyOnchain =await getBuyOnchainById(buyOnchainId);
    if(!buyOnchain){
        throw new ApiError(httpStatus.NOT_FOUND,'BuyOnchain not found');
    }
    await buyOnchain.deleteOne();
    return buyOnchain;
}

const deleteBuyAuctionOnchainbyId = async(buyOnchainId) =>{
    const buyOnchain =await getBuyOnchainById(buyOnchainId);
    if(!buyOnchain){
        throw new ApiError(httpStatus.NOT_FOUND,'BuyOnchain not found');
    }
    await buyOnchain.deleteOne();
    return buyOnchain;
}

module.exports = {
    createBuyOnchain,
    queryBuyOnchains,
    getBuyOnchainById,
    updateBuyAuctionOnchainById,
    deleteBuyAuctionOnchainbyId
}






