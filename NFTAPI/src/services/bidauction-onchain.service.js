const {AuctionOnChain,BidAuctionOnChain} = require('../models');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createBidAuctionOnchain = async (bidAuctionOnChainBody) =>{
    const {contractAddress,tokenId,creator,isErc721, ...newBidAuctionOnchainBody} = bidAuctionOnChainBody;
    const query = {contractAddress,tokenId};
    if(!isErc721) query.creator = creator;
    const auctionOnchain = await AuctionOnChain.findOne(query).sort({createdAt:-1});
    if(!auctionOnchain){
        throw new ApiError(httpStatus.NOT_FOUND,'AuctionOnchain not found!!!');
    }
    const bidAuctionOnchains = await BidAuctionOnChain.find( {auctionOnchain:auctionOnchain._id});
    if(bidAuctionOnchains.length >0){
        const bidAuctionOnChain = bidAuctionOnchains[bidAuctionOnchains.length -1];
        bidAuctionOnChain.is_claimed = true;
        await bidAuctionOnChain.save();
    }
    Object.assign(newBidAuctionOnchainBody, {
        auctionOnchain:auctionOnchain._id,
        bidAuctionId: bidAuctionOnchains.length,
    });
    return BidAuctionOnChain.create(newBidAuctionOnchainBody);
}

const queryBidAuctionOnchains = async (bidAuctionOnChainQuery) =>{
    const filter = pick(bidAuctionOnChainQuery,[]);
    const options = pick(bidAuctionOnChainQuery,['sortBy','limit','page','populate']);
    const bidAuctionOnChains = await BidAuctionOnChain.paginate(filter,options);
    return bidAuctionOnChains;
}

const getBidAuctionOnchainId = async(tokenId) =>{
    return BidAuctionOnChain.findById(tokenId);
};

const updateBidAuctionOnchainById = async( bidAuctionOnchainId,updateBody) =>{
    const bidAuctionOnchain = await getBidAuctionOnchainId(bidAuctionOnchainId);
    if(!bidAuctionOnchain){
        throw new ApiError(httpStatus.NOT_FOUND,'BidAuctionOnchain not found');
    }
    Object.assign(bidAuctionOnchain,updateBody);
    await bidAuctionOnchain.save();
    return bidAuctionOnchain;
}

const deleteBidAuctionOnchainbyId = async(bidAuctionOnchainId) =>{
    const bidAuctionOnchain = await getBidAuctionOnchainId(bidAuctionOnchainId);
    if(!bidAuctionOnchain){
        throw new ApiError(httpStatus.NOT_FOUND,'BidAuctionOnchain not found');
    }
    await bidAuctionOnchain.deleteOne();
    return bidAuctionOnchain;
}

module.exports = {
    createBidAuctionOnchain,
    queryBidAuctionOnchains,
    getBidAuctionOnchainId,
    updateBidAuctionOnchainById,
    deleteBidAuctionOnchainbyId,
}