import { AssetId, Asset } from '../types'

type AssetTypes = { [key in AssetId]: Asset }

const etheruemBlockchainAddress = '0x78192938e8fb3dd2282a483fcd2cb82caa28d85a'

export const ASSETS: AssetTypes = {
  THB: {
    id: 'THB',
    name: 'Thai Baht',
    image: require('../img/icon_cash.png'),
    unit: 'THB',
    decimal: 0,
    address: '8550517232',
    order: 0
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    coinStatsId: 'bitcoin',
    image: require('../img/icon_btc.png'),
    unit: 'BTC',
    decimal: 8,
    address: '3CfoRkvFN1JQjMpDKEGfTfroKnVuUrqtzX',
    about: 'The world’s first cryptocurrency, Bitcoin is stored and exchanged securely on the internet through a digital ledger known as a blockchain. Bitcoins are divisible into smaller units known as satoshis — each satoshi is worth 0.00000001 bitcoin.',
    order: 1
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    coinStatsId: 'ethereum',
    image: require('../img/icon_eth.png'),
    unit: 'ETH',
    decimal: 6,
    address: etheruemBlockchainAddress,
    about: 'Ethereum is both a cryptocurrency and a decentralized computing platform. Developers can use the platform to create decentralized applications and issue new crypto assets, known as Ethereum tokens.',
    order: 2
  },
  XRP: {
    id: 'XRP',
    name: 'XRP',
    coinStatsId: 'ripple',
    image: require('../img/icon_xrp.png'),
    unit: 'XRP',
    decimal: 2,
    address: 'rpXTzCuXtjiPDFysxq8uNmtZBe9Xo97JbW',
    additionalLabel: 'tag',
    additionalValue: '1092852274',
    about: 'XRP is the cryptocurrency used by the Ripple payment network. Built for enterprise use, XRP aims to be a fast, cost-efficient cryptocurrency for cross-border payments.',
    order: 3
  },
  USDT: {
    id: 'USDT',
    name: 'Tether',
    coinStatsId: 'tether',
    image: require('../img/icon_usdt.png'),
    unit: 'USDT',
    decimal: 2,
    address: '0x30e053745c1a09ead5b892f5bfc262474a926776',
    about: 'Tether (USDT) is a cryptocurrency with a value meant to mirror the value of the U.S. dollar. The idea was to create a stable cryptocurrency that can be used like digital dollars.',
    order: 4
  },
  EOS: {
    id: 'EOS',
    name: 'EOS',
    coinStatsId: 'eos',
    image: require('../img/icon_eos.png'),
    unit: 'EOS',
    decimal: 2,
    address: 'flipay.co',
    additionalLabel: 'Memo',
    additionalValue: 'Your phone number',
    about: 'EOS is a cryptocurrency running on the EOS blockchain. It’s fast, free to transfer, used for governance, and lets users and developers generate the resources they need to run applications on EOS.',
    order: 5
  },

  BNB: {
    id: 'BNB',
    name: 'Binance Coin',
    coinStatsId: 'binance-coin',
    image: require('../img/icon_bnb.png'),
    unit: 'BNB',
    decimal: 5,
    address: 'bnb1cqhh44pxqw87vcm3grzvs5la9zn3ldcx6r7k3w',
    about: 'BNB is the native cryptocurrency of Binance chain that powers the Binance decentralized exchange. It\'s also used for other purposes in the Binance ecosystem.',
    order: 6
  },
  OMG: {
    id: 'OMG',
    name: 'OmiseGo',
    coinStatsId: 'omisego',
    image: require('../img/icon_omg.png'),
    unit: 'OMG',
    decimal: 4,
    address: etheruemBlockchainAddress,
    about: 'OMG is the cryptocurrency on Ethereum network that will be used as the fuel of the decentralized payment network, the OmiseGo team are building.',
    order: 7
  }
}
