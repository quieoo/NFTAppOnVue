import request from '@/utils/request'
// const { Gateway, Wallets } = require('fabric-network')0
// const { buildCCPOrg1, buildWallet } = require('../../../../test-application/javascript/AppUtil')
export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

// '@/fabric_sdk/wallet/org1/miniter.id'
export var ClientID
export var Organization
export const walletPath = ''
export var BidsIndex = 0
export var NFTIndex = 0
export function updataBidIndex(addIndex, totalbids, callback) {
  if (totalbids === 0) {
    callback(-1)
    return
  }
  BidsIndex += addIndex
  if (BidsIndex < 0) {
    BidsIndex += totalbids
  }
  BidsIndex = BidsIndex % totalbids
  if (isNaN(BidsIndex)) {
    BidsIndex = 0
  }
  callback(BidsIndex)
}
export function getBidIndex() {
  return BidsIndex
}

export function updataNFTIndex(addIndex, totalnft, callback) {
  NFTIndex += addIndex
  if (NFTIndex < 0) {
    NFTIndex += totalnft
  }
  NFTIndex = NFTIndex % totalnft

  if (isNaN(NFTIndex)) {
    NFTIndex = 0
  }
  callback(NFTIndex)
}
export function getNFTIndex() {
  return BidsIndex
}

export function updateClientID(newid) {
  // eslint-disable-next-line no-path-concat
  if (newid === 'admin') {
    Organization = 'org1'
  } else {
    Organization = 'org2'
  }
  ClientID = newid
}
export function getClientID() {
  return ClientID
}
export function getWalletPath() {
  return walletPath
}

export function getOrg() {
  return Organization
}
/*
export async function Mint(tokenid, data) {
  const ccp1 = buildCCPOrg1()
  const wallet = await buildWallet(Wallets, walletPath)
  const gateway = new Gateway()
  await gateway.connect(ccp1, {
    wallet: wallet,
    identity: ClientID,
    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
  })
}*/

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
