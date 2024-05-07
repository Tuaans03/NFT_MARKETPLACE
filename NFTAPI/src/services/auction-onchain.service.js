const {AuctionOnChain,BidAuctionOnChain} = require('../models');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const  ApiError = require('../utils/ApiError');

const createAuctionOnchain = async (auctionOnChainBody) =>{
    const {contractAddress,tokenId,creator,isErc721} = auctionOnChainBody;
    const query = {contractAddress,tokenId};
    if(!isErc721) query.creator = creator;
    const auctionOnChains = await AuctionOnChain.find(query);
    auctionOnChainBody.auctionId = auctionOnChains.length;
    return AuctionOnChain.create(auctionOnChainBody);
}

const queryAuctionOnchain = async (auctionOnchainQuery) =>{
    filter = pick(auctionOnchainQuery,[]);
    const options = pick(auctionOnchainQuery, ['sortBy','limit','page','populate']);
    const auctionOnchains = await AuctionOnChain.paginate(filter,options);
    return auctionOnchains
}

const getAuctionOnchainById = async(id) =>{
    return AuctionOnChain.findById(id);
}

const updateAuctionOnchainById = async(auctionOnchainId, updateBody) =>{
    const auctionOnchain = await getAuctionOnchainById(auctionOnchainId);
    if(!auctionOnchain){
        throw new ApiError(httpStatus.NOT_FOUND, 'AuctionOnchain not found');
    }
    Object.assign(auctionOnchain,updateBody);
    await auctionOnchain.save();
    return auctionOnchain;
}

const endAuctionOnchain = async(contractAddress , tokenId, creator, isErc721,status) =>{
    const query = {contractAddress,tokenId};
    if(!isErc721) query.creator = creator;
    const auctionOnchain = await AuctionOnChain.findOne(query).sort({createdAt: -1});

    if(!auctionOnchain){
        throw new ApiError(httpStatus.NOT_FOUND,'AuctionOnchain not found!!!');
    }
    if(status === 'cancelled'){
        auctionOnchain.status = 'cancelled';
        await auctionOnchain.save();
        return;
    }
    const bidAuctionOnChain = await BidAuctionOnChain.findOne({auctionOnchain : auctionOnchain._id}).sort({createdAt:-1,});
    if(!bidAuctionOnChain){
        throw new ApiError(httpStatus.NOT_FOUND,'BidauctionOnChain not found');
    }

    if(status === 'ended'){
        auctionOnchain.status = 'ended';
        await auctionOnchain.save();
        bidAuctionOnChain.is_winned = true;
        await bidAuctionOnChain.save();
    }
    else if(status == 'claimed'){
        const bidAuctionOnChain = await BidAuctionOnChain.findOne({auctionOnchain:auctionOnchain._id}).sort({createdAt:-1});
        bidAuctionOnChain.isWinner = true;
        bidAuctionOnChain.isClaimed = true;
        await bidAuctionOnChain.save();
    }
}

const deleteAuctionOnchainById = async (auctionOnchainId)=>{
    const auctionOnchain = await getAuctionOnchainById(auctionOnchainId);
    if(!auctionOnchain){
        throw new ApiError(httpStatus.NOT_FOUND, 'AuctionOnchain not found');
    }
    await auctionOnchain.deleteOne();
    return auctionOnchain;
}

module.exports = {
    createAuctionOnchain,
    queryAuctionOnchain,
    getAuctionOnchainById,
    updateAuctionOnchainById,
    endAuctionOnchain,
    deleteAuctionOnchainById,
};