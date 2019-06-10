import { AssetId, Asset } from '../types'

type AssetTypes = { [key in AssetId]: Asset }

const etheruemBlockchainAddress = '0x9e1D9c3A2947D37f169113730da2026a113Ce78B'

export const ASSETS: AssetTypes = {
  THB: {
    id: 'THB',
    name: 'Thai Baht',
    image: require('../img/icon_cash.png'),
    unit: 'THB',
    decimal: 0,
    priceSource: 'bxth',
    address: '8550517232',
    order: 0
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    image: require('../img/icon_btc.png'),
    unit: 'BTC',
    decimal: 8,
    priceSource: 'bxth',
    address: '3Hgise57pmBzR21dLBXgHUV8SRYznCVeS1',
    about: 'The world’s first cryptocurrency, Bitcoin is stored and exchanged securely on the internet through a digital ledger known as a blockchain. Bitcoins are divisible into smaller units known as satoshis — each satoshi is worth 0.00000001 bitcoin.',
    order: 1
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    image: require('../img/icon_eth.png'),
    unit: 'ETH',
    decimal: 6,
    priceSource: 'bxth',
    address: etheruemBlockchainAddress,
    about: 'Ethereum is both a cryptocurrency and a decentralized computing platform. Developers can use the platform to create decentralized applications and issue new crypto assets, known as Ethereum tokens.',
    order: 2
  },
  XRP: {
    id: 'XRP',
    name: 'XRP',
    image: require('../img/icon_xrp.png'),
    unit: 'XRP',
    decimal: 2,
    priceSource: 'bxth',
    address: 'rp7Fq2NQVRJxQJvUZ4o8ZzsTSocvgYoBbs',
    tag: '1001263698',
    about: 'XRP is the cryptocurrency used by the Ripple payment network. Built for enterprise use, XRP aims to be a fast, cost-efficient cryptocurrency for cross-border payments.',
    order: 3
  },
  BNB: {
    id: 'BNB',
    name: 'Binance Coin',
    image: require('../img/icon_binance.png'),
    unit: 'BNB',
    decimal: 5,
    priceSource: 'binance',
    address: 'bnb1cqhh44pxqw87vcm3grzvs5la9zn3ldcx6r7k3w',
    about: 'BNB is the native cryptocurrency of Binance chain that powers the Binance decentralized exchange. It\'s also used for other purposes in the Binance ecosystem.',
    order: 4
  },
  OMG: {
    id: 'OMG',
    name: 'OmiseGo',
    image: require('../img/icon_omg.png'),
    unit: 'OMG',
    decimal: 4,
    priceSource: 'bxth',
    address: etheruemBlockchainAddress,
    about: 'OMG is the cryptocurrency on Ethereum network that will be used as the fuel of the decentralized payment network, the OmiseGo team are building.',
    order: 5
  }
}
