/*#if _EVM

import { wallets } from '@depay/web3-wallets-evm'

/*#elif _SOLANA

import { wallets } from '@depay/web3-wallets-solana'

//#else */

import { wallets } from '@depay/web3-wallets'

//#endif

import { supported } from '../blockchains'

export default [
  {
    "name": "Coinbase",
    "extension": "Coinbase",
    "link": "WalletLink",
    "mobile": { 
      "ios": { "native": "cbwallet://dapp", "universal": "https://go.cb-w.com/dapp" },
      "android": { "native": "cbwallet://dapp", "universal": "https://go.cb-w.com/dapp" },
    },
    "logo": wallets.Coinbase.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "MetaMask",
    "extension": "MetaMask",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "metamask:", "encoded": false, "universal": "https://metamask.app.link" },
      "android": { "native": "metamask:", "encoded": false, "universal": "https://metamask.app.link" },
    },
    "logo": wallets.MetaMask.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Phantom",
    "extension": "Phantom",
    "mobile": {
      "ios": { "native": "phantom:", "universal": "https://phantom.app/ul", "open": ()=>`https://phantom.app/ul/browse/${encodeURIComponent(window.location.toString())}` },
      "android": { "native": "phantom:", "universal": "https://phantom.app/ul", "open": ()=>`https://phantom.app/ul/browse/${encodeURIComponent(window.location.toString())}` },
    },
    "logo": wallets.Phantom.info.logo,
    "blockchains": [...supported.solana]
  },
  {
    "name": "Trust Wallet",
    "extension": "Trust",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "trust:", "universal": "https://link.trustwallet.com" },
      "android": { "native": "trust:", "universal": "https://link.trustwallet.com" },
    },
    "logo": wallets.Trust.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Binance Wallet",
    "extension": "Binance",
    "link": "WalletConnectV1",
    "logo": wallets.Binance.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Crypto.com | DeFi Wallet",
    "extension": "CryptoCom",
    "link": "WalletConnectV1",
    "desktop": { "native": "cryptowallet:" },
    "mobile": { 
      "ios": { "native": "crypto:", "universal": "https://crypto.onelink.me/veNW" },
      "android": { "native": "wc:", "universal": "https://crypto.onelink.me/veNW" },
    },
    "logo": wallets.CryptoCom.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Coin98",
    "extension": "Coin98",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "coin98:", "universal": "https://coin98.services" },
      "android": { "native": "coin98:", "universal": "https://coin98.services" },
    },
    "logo": wallets.Coin98.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Brave",
    "extension": "Brave",
    "logo": wallets.Brave.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Rainbow",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://rnbwapp.com" },
      "android": { "native": "rainbow:", "universal": "https://rnbwapp.com" },
    },
    "logo": "https://img1.depay.com/wallets/rainbow.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Timeless Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "timeless-wallet:", "universal": "https://timelesswallet.xyz" },
      "android": { "native": "timeless-wallet:", "universal": "https://timelesswallet.xyz" },
    },
    "logo": "https://img1.depay.com/wallets/timeless.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Uniswap Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "uniswap:", "universal": "https://uniswap.org/app" },
    },
    "logo": "https://img1.depay.com/wallets/uniswap_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Safe",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "safe:", "universal": "https://app.safe.global" },
      "android": { "native": "safe:", "universal": "https://app.safe.global" },
    },
    "logo": "https://img1.depay.com/wallets/safe.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Rabby",
    "extension": "Rabby",
    "link": "WalletConnectV1",
    "logo": wallets.Rabby.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Backpack",
    "extension": "Backpack",
    "logo": wallets.Backpack.info.logo,
    "blockchains": [...supported.solana]
  },
  {
    "name": "Glow",
    "extension": "Glow",
    "logo": wallets.Glow.info.logo,
    "blockchains": [...supported.solana]
  },
  {
    "name": "Solflare",
    "extension": "Solflare",
    "mobile": {
      "ios": { "native": "solflare:", "universal": "https://solflare.com/ul", "open": ()=>`https://solflare.com/ul/browse/${encodeURIComponent(window.location.toString())}` },
      "android": { "native": "solflare:", "universal": "https://solflare.com/ul", "open": ()=>`https://solflare.com/ul/browse/${encodeURIComponent(window.location.toString())}` },
    },
    "logo": wallets.Solflare.info.logo,
    "blockchains": [...supported.solana]
  },
  {
    "name": "imToken",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "imtokenv2:" },
      "android": { "native": "imtokenv2:" },
    },
    "logo": "https://img1.depay.com/wallets/imtoken.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "MEW wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "mewwallet:" , "universal": "https://mewwallet.com" },
      "android": { "native": "mewwallet:" , "universal": "https://mewwallet.com" },
    },
    "logo": "https://img1.depay.com/wallets/mew_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ONTO",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ontoprovider:" },
      "android": { "native": "ontoprovider:" },
    },
    "logo": "https://img1.depay.com/wallets/onto.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Zerion",
    "link": "WalletConnectV1",
    "desktop": { "native": "zerion://" },
    "mobile": { 
      "ios": { "native": "zerion://", "universal": "https://wallet.zerion.io" },
      "android": { "native": "zerion://", "universal": "https://wallet.zerion.io" },
    },
    "logo": "https://img1.depay.com/wallets/zerion.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Spot",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "spot://", "universal": "https://spot.so" },
      "android": { "native": "spot://", "universal": "https://spot.so" },
    },
    "logo": "https://img1.depay.com/wallets/spot.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BitKeep",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitkeep://", "universal": "https://bkapp.vip" },
      "android": { "native": "bitkeep://", "universal": "https://bkapp.vip" },
    },
    "logo": "https://img1.depay.com/wallets/bit_keep.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Unstoppable Domains",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://unstoppabledomains.com/mobile" },
      "android": { "universal": "https://unstoppabledomains.com/mobile" },
    },
    "logo": "https://img1.depay.com/wallets/unstoppable_domains.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Omni",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "omni", "universal": "https://links.omni.app" },
      "android": { "native": "omni", "universal": "https://links.omni.app" },
    },
    "logo": "https://img1.depay.com/wallets/omni.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "KEYRING PRO",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "keyring:", "universal": "https://keyring.app" },
      "android": { "native": "keyring:", "universal": "https://keyring.app" },
    },
    "logo": "https://img1.depay.com/wallets/keyring_pro.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "TokenPocket",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "tpoutside:" },
      "android": { "native": "tpoutside:" },
    },
    "logo": "https://img1.depay.com/wallets/token_pocket.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BitPay",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitpay:", "universal": "https://link.bitpay.com/wallet" },
      "android": { "native": "bitpay:", "universal": "https://link.bitpay.com/wallet" },
    },
    "logo": "https://img1.depay.com/wallets/bitpay.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "MathWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "mathwallet:", "universal": "https://www.mathwallet.org" },
      "android": { "native": "mathwallet:", "universal": "https://www.mathwallet.org" },
    },
    "logo": "https://img1.depay.com/wallets/math_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ledger Live",
    "link": "WalletConnectV1",
    "desktop": { "native": "ledgerlive:" },
    "mobile": { 
      "ios": { "native": "ledgerlive:" },
      "android": { "native": "ledgerlive:" },
    },
    "logo": "https://img1.depay.com/wallets/ledger_live.jpg",
    "connectionLink": true,
    "blockchains": [...supported.evm]
  },
  {
    "name": "1inch Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "1inch:", "universal": "https://wallet.1inch.io" },
      "android": { "native": "1inch:", "universal": "https://wallet.1inch.io" },
    },
    "logo": "https://img1.depay.com/wallets/1inch_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "iToken Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "huobiwallet:" },
      "android": { "native": "huobiwallet:" },
    },
    "logo": "https://img1.depay.com/wallets/i_token_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Huddln",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "huddln:" },
      "android": { "native": "huddln:" },
    },
    "logo": "https://img1.depay.com/wallets/huddln.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Eidoo",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "eidoo:", "universal": "https://eidoo.io/crypto-wallet" },
      "android": { "native": "eidoo:", "universal": "https://eidoo.io/crypto-wallet" },
    },
    "logo": "https://img1.depay.com/wallets/eidoo.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CoolWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "coolwallet:" },
      "android": { "native": "coolwallet:" },
    },
    "logo": "https://img1.depay.com/wallets/cool_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Unstoppable Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "unstoppabledomains:", "universal": "https://unstoppabledomains.com/mobile" },
      "android": { "native": "unstoppabledomains:", "universal": "https://unstoppabledomains.com/mobile" },
    },
    "logo": "https://img1.depay.com/wallets/unstoppable_domains.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "AlphaWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "awallet:", "universal": "https://aw.app" },
      "android": { "native": "awallet:", "universal": "https://aw.app" },
    },
    "logo": "https://img1.depay.com/wallets/alpha_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Pillar",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "pillarwallet:" },
      "android": { "native": "pillarwallet:" },
    },
    "logo": "https://img1.depay.com/wallets/pillar.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "D'CENT Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "dcent:", "universal": "https://link.dcentwallet.com" },
      "android": { "native": "dcent:", "universal": "https://link.dcentwallet.com" },
    },
    "logo": "https://img1.depay.com/wallets/dcent.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ZelCore",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "zel:", "universal": "https://link.zel.network" },
      "android": { "native": "zel:", "universal": "https://link.zel.network" },
    },
    "logo": "https://img1.depay.com/wallets/zel_core.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Nash",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "nash:", "universal": "https://nash.io/walletconnect" },
      "android": { "native": "nash:", "universal": "https://nash.io/walletconnect" },
    },
    "logo": "https://img1.depay.com/wallets/nash.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Coinomi",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://coinomi.page.link" },
      "android": { "universal": "https://coinomi.page.link" },
    },
    "logo": "https://img1.depay.com/wallets/coinomi.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CYBAVO Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "cybavowallet:", "universal": "https://cdn.cybavo.com" },
      "android": { "native": "cybavowallet:", "universal": "https://cdn.cybavo.com" },
    },
    "logo": "https://img1.depay.com/wallets/cybavo.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Tokenary",
    "link": "WalletConnectV1",
    "desktop": { "native": "tokenary:", "universal": "https://tokenary.io" },
    "logo": "https://img1.depay.com/wallets/tokenary.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Torus",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/torus.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SafePal",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://link.safepal.io" },
      "android": { "universal": "https://link.safepal.io" },
    },
    "logo": "https://img1.depay.com/wallets/safepal.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Infinity Wallet",
    "link": "WalletConnectV1",
    "desktop": { "native": "infinity:", "universal": "https://infinitywallet.io/" },
    "logo": "https://img1.depay.com/wallets/infinity_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bridge Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bridgewallet:", "universal": "https://bridge.mtpelerin.com" },
      "android": { "native": "bridgewallet:", "universal": "https://bridge.mtpelerin.com" },
    },
    "logo": "https://img1.depay.com/wallets/mtperlin.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SparkPoint",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "sparkpoint:", "universal": "https://sparkpoint.io" },
      "android": { "native": "sparkpoint:", "universal": "https://sparkpoint.io" },
    },
    "logo": "https://img1.depay.com/wallets/sparkpoint.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "PEAKDEFI Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "peakdefiwallet:", "universal": "https://peakdefi.com/download" },
      "android": { "native": "peakdefiwallet:", "universal": "https://peakdefi.com/download" },
    },
    "logo": "https://img1.depay.com/wallets/peakdefi.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "AT.Wallet",
    "link": "WalletConnectV1",
    "desktop": { "native": "atwallet:" },
    "mobile": { 
      "ios": { "native": "atwallet:" },
      "android": { "native": "atwallet:" },
    },
    "logo": "https://img1.depay.com/wallets/atwallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ellipal",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ellipal:", "universal": "https://www.ellipal.com/" },
      "android": { "native": "ellipal:", "universal": "https://www.ellipal.com/" },
    },
    "logo": "https://img1.depay.com/wallets/ellipal.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Aktionariat",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "aktionariat:", "universal": "https://app.aktionariat.com" },
      "android": { "native": "aktionariat:", "universal": "https://app.aktionariat.com" },
    },
    "logo": "https://img1.depay.com/wallets/aktionariat.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Talken Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "talken-wallet:", "universal": "https://talken.io" },
      "android": { "native": "talken-wallet:", "universal": "https://talken.io" },
    },
    "logo": "https://img1.depay.com/wallets/talken.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "KyberSwap",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "kyberswap:", "universal": "https://kyberswapnew.app.link" },
      "android": { "native": "kyberswap:", "universal": "https://kyberswapnew.app.link" },
    },
    "logo": "https://img1.depay.com/wallets/kyberswap.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Tongue Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "tongue:", "universal": "https://www.tongue.fi" },
      "android": { "native": "tongue:", "universal": "https://www.tongue.fi" },
    },
    "logo": "https://img1.depay.com/wallets/tongue.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "RWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "rwallet:", "universal": "https://www.rwallet.app" },
      "android": { "native": "rwallet:", "universal": "https://www.rwallet.app" },
    },
    "logo": "https://img1.depay.com/wallets/rwallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "O3Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "o3wallet:", "universal": "https://o3.network" },
      "android": { "native": "o3wallet:", "universal": "https://o3.network" },
    },
    "logo": "https://img1.depay.com/wallets/o3wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "HashKey Me",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "hashme:", "universal": "https://me.hashkey.com" },
      "android": { "native": "hashme:", "universal": "https://me.hashkey.com" },
    },
    "logo": "https://img1.depay.com/wallets/hashkeyme.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Guarda Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/guarda.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Defiant",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "defiantapp:", "universal": "https://defiantapp.tech" },
      "android": { "native": "defiantapp:", "universal": "https://defiantapp.tech" },
    },
    "logo": "https://img1.depay.com/wallets/defiant.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Valora",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "celo://wallet", "universal": "https://valoraapp.com" },
      "android": { "native": "celo://wallet", "universal": "https://valoraapp.com" },
    },
    "logo": "https://img1.depay.com/wallets/valora.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Celo Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "celowallet:" },
      "android": { "native": "celowallet:" },
    },
    "logo": "https://img1.depay.com/wallets/celo.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Elastos Essentials",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "essentials:", "universal": "https://essentials.elastos.net" },
      "android": { "native": "essentials:", "universal": "https://essentials.elastos.net" },
    },
    "logo": "https://img1.depay.com/wallets/elastos_essentials.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Stasis",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "stasis:", "universal": "https://app.stasis.net" },
      "android": { "native": "stasis:", "universal": "https://app.stasis.net" },
    },
    "logo": "https://img1.depay.com/wallets/stasis.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "JulWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "julwallet:", "universal": "https://justliquidity.org" },
      "android": { "native": "julwallet:", "universal": "https://justliquidity.org" },
    },
    "logo": "https://img1.depay.com/wallets/julwallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bitpie",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitpie:" },
      "android": { "native": "bitpie:" },
    },
    "logo": "https://img1.depay.com/wallets/bitpie.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Minerva Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "minerva:", "universal": "https://minerva.digital" },
      "android": { "native": "minerva:", "universal": "https://minerva.digital" },
    },
    "logo": "https://img1.depay.com/wallets/minerva.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Tangem",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "tangem:", "universal": "https://app.tangem.com" },
      "android": { "native": "tangem:", "universal": "https://app.tangem.com" },
    },
    "logo": "https://img1.depay.com/wallets/tangem.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ioPay",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "iopay:" },
      "android": { "native": "iopay:" },
    },
    "logo": "https://img1.depay.com/wallets/io_pay.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Coinhub",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/coinhub.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Go Pocket",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/gopocket.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Wallet 3",
    "link": "WalletConnectV1",
    "desktop": { "native": "wallet3:" },
    "logo": "https://img1.depay.com/wallets/wallet3.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "yiToken",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "yitoken:" },
      "android": { "native": "yitoken:" },
    },
    "logo": "https://img1.depay.com/wallets/yitoken.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "DID Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "abt:" },
      "android": { "native": "abt:" },
    },
    "logo": "https://img1.depay.com/wallets/didwallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Shinobi Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "shinobi-wallet://" },
      "android": { "native": "shinobi-wallet://" },
    },
    "logo": "https://img1.depay.com/wallets/shinobi_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "AirGap Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "airgap-wallet://" },
      "android": { "native": "airgap-wallet://" },
    },
    "logo": "https://img1.depay.com/wallets/air_gap_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SecuX",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "secux://", "universal": "https://wsweb.secuxtech.com" },
      "android": { "native": "secux://", "universal": "https://wsweb.secuxtech.com" },
    },
    "logo": "https://img1.depay.com/wallets/secux.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Orange",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "orangewallet:", "universal": "https://link.orangewallet.app" },
      "android": { "native": "orangewallet:", "universal": "https://link.orangewallet.app" },
    },
    "logo": "https://img1.depay.com/wallets/orange.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Krystal",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "krystalWallet:" },
      "android": { "native": "krystalWallet:" },
    },
    "logo": "https://img1.depay.com/wallets/krystal.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Kriptomat",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "kriptomatapp://wallet-connect" },
      "android": { "native": "kriptomatapp://wallet-connect" },
    },
    "logo": "https://img1.depay.com/wallets/kriptomat.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ambire Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ambire:", "universal": "https://mobile.ambire.com" },
      "android": { "native": "ambire:", "universal": "https://mobile.ambire.com" },
    },
    "logo": "https://img1.depay.com/wallets/ambire_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "PayBolt",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "paybolt://Wallet" },
      "android": { "native": "paybolt://Wallet" },
    },
    "logo": "https://img1.depay.com/wallets/pay_bolt.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "OKX Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "okex://main" },
      "android": { "native": "okex://main" },
    },
    "logo": "https://img1.depay.com/wallets/okx_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Mask Network",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/mask_network.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Uniblow",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/uniblow.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Autonomy: Digital Art Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "autonomy-wc", "universal": "https://autonomy.io/apps/wc" },
      "android": { "native": "autonomy-wc", "universal": "https://autonomy.io/apps/wc" },
    },
    "logo": "https://img1.depay.com/wallets/autonomy.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Lilico",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "lilico://", "universal": "https://link.lilico.app/wc" },
      "android": { "native": "lilico://", "universal": "https://link.lilico.app/wc" },
    },
    "logo": "https://img1.depay.com/wallets/lilico.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Fireblocks",
    "link": "WalletConnectV1",
    "desktop": { "universal": "https://console.fireblocks.io/v2" },
    "mobile": { 
      "ios": { "native": "fireblocks-wc://" },
      "android": { "native": "fireblocks-wc://" },
    },
    "logo": "https://img1.depay.com/wallets/fireblocks.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "WATT ME",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "wattwallet://wallet-connect/" },
      "android": { "native": "wattwallet://wallet-connect/" },
    },
    "logo": "https://img1.depay.com/wallets/wattme.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Coingrig",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "coingrig://", "universal": "https://link.coingrig.com" },
      "android": { "native": "coingrig://", "universal": "https://link.coingrig.com" },
    },
    "logo": "https://img1.depay.com/wallets/coingrig.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Cryptnox Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/cryptnox_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "bobablocks",
    "link": "WalletConnectV1",
    "desktop": { "native": "bobablocks://" },
    "mobile": { 
      "ios": { "native": "bobablocks://", "universal": "https://app.bobablocks.io" },
      "android": { "native": "bobablocks://", "universal": "https://app.bobablocks.io" },
    },
    "logo": "https://img1.depay.com/wallets/bobablocks.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Plasma Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "plasmawallet:", "universal": "https://plasma-wallet.com" },
      "android": { "native": "plasmawallet:", "universal": "https://plasma-wallet.com" },
    },
    "logo": "https://img1.depay.com/wallets/plasma_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "HUMBL WALLET",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "humblwallet:", "universal": "https://wallet.search3.com" },
      "android": { "native": "humblwallet:", "universal": "https://wallet.search3.com" },
    },
    "logo": "https://img1.depay.com/wallets/humbl_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Zelus",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "zeluswallet://" },
      "android": { "native": "zeluswallet://" },
    },
    "logo": "https://img1.depay.com/wallets/zelus.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Earth Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "earthwallet:" },
      "android": { "native": "earthwallet:" },
    },
    "logo": "https://img1.depay.com/wallets/earth_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Boba Multisig",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/boba_multisig.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "EASY",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "co.theeasy.app://", "universal": "https://link.easy.me" },
      "android": { "native": "co.theeasy.app://", "universal": "https://link.easy.me" },
    },
    "logo": "https://img1.depay.com/wallets/easy.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ISLAMIwallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "islamiwallet://islami.com/path/", "universal": "https://islamiwallet.com" },
      "android": { "native": "islamiwallet://islami.com/path/", "universal": "https://islamiwallet.com" },
    },
    "logo": "https://img1.depay.com/wallets/islam_iwallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Card Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "cardwallet://", "universal": "https://wallet.cardstack.com" },
      "android": { "native": "cardwallet://", "universal": "https://wallet.cardstack.com" },
    },
    "logo": "https://img1.depay.com/wallets/card_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "GameStop Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/game_stop_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "RealT Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/real_t_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "PLTwallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "pltwallet:", "universal": "https://pltwallet.io/" },
      "android": { "native": "pltwallet:", "universal": "https://pltwallet.io/" },
    },
    "logo": "https://img1.depay.com/wallets/pl_twallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Avacus",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "avacus://", "universal": "https://avacus.app.link" },
      "android": { "native": "avacus://", "universal": "https://avacus.app.link" },
    },
    "logo": "https://img1.depay.com/wallets/avacus.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "StrikeX Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "strikex://" },
      "android": { "native": "strikex://" },
    },
    "logo": "https://img1.depay.com/wallets/strike_x_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BCERTin wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/bcer_tin_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Edge Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "edge://", "universal": "https://deep.edge.app/wc" },
      "android": { "native": "edge://", "universal": "https://deep.edge.app/wc" },
    },
    "logo": "https://img1.depay.com/wallets/edge_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Freedom Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "freedom-wallet://" },
      "android": { "native": "freedom-wallet://" },
    },
    "logo": "https://img1.depay.com/wallets/freedom_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Assure",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "assure://", "universal": "https://www.assure.pro/Official" },
      "android": { "native": "assure://", "universal": "https://www.assure.pro/Official" },
    },
    "logo": "https://img1.depay.com/wallets/assure.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Cosmostation",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "cosmostation://" },
      "android": { "native": "cosmostation://" },
    },
    "logo": "https://img1.depay.com/wallets/cosmostation.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "THORWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "thorwallet:" },
      "android": { "native": "thorwallet:" },
    },
    "logo": "https://img1.depay.com/wallets/thor_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Gryfyn",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/gryfyn.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CoinStats",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "coinstats:", "universal": "https://coinstats.app" },
      "android": { "native": "coinstats:", "universal": "https://coinstats.app" },
    },
    "logo": "https://img1.depay.com/wallets/coin_stats.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Abra Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "abra:" },
      "android": { "native": "abra:" },
    },
    "logo": "https://img1.depay.com/wallets/abra_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Opera Crypto Browser",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "cryptobrowser://" },
      "android": { "native": "cryptobrowser://" },
    },
    "logo": "https://img1.depay.com/wallets/opera_crypto_browser.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Keywallet Touch",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "keywalletTouch://" },
      "android": { "native": "keywalletTouch://" },
    },
    "logo": "https://img1.depay.com/wallets/keywallet_touch.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Enno Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ennowallet:" },
      "android": { "native": "ennowallet:" },
    },
    "logo": "https://img1.depay.com/wallets/enno_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "A4 Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/a4_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bitcoin.com Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitcoincom://", "universal": "https://wallet.bitcoin.com/" },
      "android": { "native": "bitcoincom://", "universal": "https://wallet.bitcoin.com/" },
    },
    "logo": "https://img1.depay.com/wallets/bitcoincom.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Defiant",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "defiantapp://", "universal": "https://defiantapp.tech/" },
      "android": { "native": "defiantapp://", "universal": "https://defiantapp.tech/" },
    },
    "logo": "https://img1.depay.com/wallets/defiant.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Chain",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/chain.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Verso",
    "link": "WalletConnectV1",
    "desktop": { "native": "verso" },
    "mobile": { 
      "ios": { "native": "verso" },
      "android": { "native": "verso" },
    },
    "logo": "https://img1.depay.com/wallets/verso.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "LOBSTR Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "lobstr://", "universal": "https://lobstr.co/uni/wc" },
      "android": { "native": "lobstr://", "universal": "https://lobstr.co/uni/wc" },
    },
    "logo": "https://img1.depay.com/wallets/lobstr_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bifrost Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bifrostwallet:", "universal": "https://app.bifrostwallet.com" },
      "android": { "native": "bifrostwallet:", "universal": "https://app.bifrostwallet.com" },
    },
    "logo": "https://img1.depay.com/wallets/bifrost_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Okse Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "oksewallet:" },
      "android": { "native": "oksewallet:" },
    },
    "logo": "https://img1.depay.com/wallets/okse_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BRISE Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/brise_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "HyperPay",
    "extension": "HyperPay",
    "link": "WalletConnectV1",
    "logo": wallets.HyperPay.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "ATON",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/aton.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Frontier",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "frontier://" },
      "android": { "native": "frontier://" },
    },
    "logo": "https://img1.depay.com/wallets/frontier.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "MDAO Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ttmwalletapp://" },
      "android": { "native": "ttmwalletapp://" },
    },
    "logo": "https://img1.depay.com/wallets/mdao_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "TTM Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ttmwalletapp:" },
      "android": { "native": "ttmwalletapp:" },
    },
    "logo": "https://img1.depay.com/wallets/ttm_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Opto Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "opto://" },
      "android": { "native": "opto://" },
    },
    "logo": "https://img1.depay.com/wallets/opto_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "XFUN Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "xfunwallet://", "universal": "https://xfun.io" },
      "android": { "native": "xfunwallet://", "universal": "https://xfun.io" },
    },
    "logo": "https://img1.depay.com/wallets/xfun_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Exodus",
    "link": "WalletConnectV1",
    "desktop": { "native": "exodus://" },
    "mobile": { 
      "ios": { "universal": "https://exodus.com/m" },
      "android": { "native": "wc://" },
    },
    "logo": "https://img1.depay.com/wallets/exodus.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Uvtoken",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "UvToken://" },
      "android": { "native": "UvToken://" },
    },
    "logo": "https://img1.depay.com/wallets/uv_token.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "PREMA Wallet",
    "link": "WalletConnectV1",
    "desktop": { "native": "premawallet:" },
    "mobile": { 
      "ios": { "native": "premawallet:", "universal": "https://premanft.com" },
      "android": { "native": "premawallet:", "universal": "https://premanft.com" },
    },
    "logo": "https://img1.depay.com/wallets/prema_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Shinobi-Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "shinobi-wallet://" },
      "android": { "native": "shinobi-wallet://" },
    },
    "logo": "https://img1.depay.com/wallets/shinobi.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ByteBank",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "hideoutWallet:" },
      "android": { "native": "hideoutWallet:" },
    },
    "logo": "https://img1.depay.com/wallets/byte_bank.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ancrypto Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ancrypto://app" },
      "android": { "native": "ancrypto://app" },
    },
    "logo": "https://img1.depay.com/wallets/ancrypto_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bee Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "beewallet.app://", "universal": "https://beewallet.app/wc" },
      "android": { "native": "beewallet.app://", "universal": "https://beewallet.app/wc" },
    },
    "logo": "https://img1.depay.com/wallets/bee_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "LATOKEN Multichain DeFi Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "dfwallet:" },
      "android": { "native": "dfwallet:" },
    },
    "logo": "https://img1.depay.com/wallets/latoken_multichain_de_fi_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "TK Finance",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "tk://", "universal": "https://trustkeys.network" },
      "android": { "native": "tk://", "universal": "https://trustkeys.network" },
    },
    "logo": "https://img1.depay.com/wallets/tk_finance.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Oxalus Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "oxalus://", "universal": "https://deeplink.oxalus.io" },
      "android": { "native": "oxalus://", "universal": "https://deeplink.oxalus.io" },
    },
    "logo": "https://img1.depay.com/wallets/oxalus_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "3S Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bhcwallet://" },
      "android": { "native": "bhcwallet://" },
    },
    "logo": "https://img1.depay.com/wallets/3_s_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Klever Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "kleverwallet:", "universal": "https://klever.page.link" },
      "android": { "native": "kleverwallet:", "universal": "https://klever.page.link" },
    },
    "logo": "https://img1.depay.com/wallets/klever_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "OneKey",
    "link": "WalletConnectV1",
    "desktop": { "native": "onekey-wallet://" },
    "mobile": { 
      "ios": { "native": "onekey-wallet://", "universal": "https://app.onekey.so/wc/connect" },
      "android": { "native": "onekey-wallet://", "universal": "https://app.onekey.so/wc/connect" },
    },
    "logo": "https://img1.depay.com/wallets/one_key.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "helix id",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "helix-id://helix-id.com" },
      "android": { "native": "helix-id://helix-id.com" },
    },
    "logo": "https://img1.depay.com/wallets/helix_id.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ABC Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "abc-wallet://abcwc", "universal": "https://abcwalletconnect.page.link" },
      "android": { "native": "abc-wallet://abcwc", "universal": "https://abcwalletconnect.page.link" },
    },
    "logo": "https://img1.depay.com/wallets/abcwallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "HaHa",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "haha://", "universal": "https://haha.me" },
      "android": { "native": "haha://", "universal": "https://haha.me" },
    },
    "logo": "https://img1.depay.com/wallets/haha.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Volt: DeFi",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "volt:", "universal": "https://get.voltage.finance" },
      "android": { "native": "volt:", "universal": "https://get.voltage.finance" },
    },
    "logo": "https://img1.depay.com/wallets/volt.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Wirex Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "wirexwallet://", "universal": "https://wwallet.app.link" },
      "android": { "native": "wirexwallet://", "universal": "https://wwallet.app.link" },
    },
    "logo": "https://img1.depay.com/wallets/wirex_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Robinhood Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "robinhood-wallet:" },
      "android": { "native": "robinhood-wallet:" },
    },
    "logo": "https://img1.depay.com/wallets/robinhood_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "RiceWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ricewallet", "universal": "https://ricewallet.io" },
      "android": { "native": "ricewallet", "universal": "https://ricewallet.io" },
    },
    "logo": "https://img1.depay.com/wallets/rice_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SafeMoon",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "safemoon:", "universal": "https://safemoon.net/" },
      "android": { "native": "safemoon:", "universal": "https://safemoon.net/" },
    },
    "logo": "https://img1.depay.com/wallets/safemoon.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SimpleHold",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "simplehold://", "universal": "https://simplehold.io" },
      "android": { "native": "simplehold://", "universal": "https://simplehold.io" },
    },
    "logo": "https://img1.depay.com/wallets/simple_hold.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "GoldBit",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "goldbit://" },
      "android": { "native": "goldbit://" },
    },
    "logo": "https://img1.depay.com/wallets/gold_bit.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ioPay",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "iopay:" },
      "android": { "native": "iopay:" },
    },
    "logo": "https://img1.depay.com/wallets/iopay.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bitizen",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitizen://wallet", "universal": "https://bitizen.org/wallet" },
      "android": { "native": "bitizen://wallet", "universal": "https://bitizen.org/wallet" },
    },
    "logo": "https://img1.depay.com/wallets/bitizen.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Slavi Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "slaviwallet:", "universal": "https://www.slaviwallet.io" },
      "android": { "native": "slaviwallet:", "universal": "https://www.slaviwallet.io" },
    },
    "logo": "https://img1.depay.com/wallets/slavi_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Nufinetes",
    "link": "WalletConnectV1",
    "desktop": { "native": "vimwallet:/" },
    "mobile": { 
      "ios": { "native": "vimwallet:/", "universal": "https://apple.vimworld.org" },
      "android": { "native": "vimwallet:/", "universal": "https://apple.vimworld.org" },
    },
    "logo": "https://img1.depay.com/wallets/nufinetes.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Arianee Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "com.arianee.wallet", "universal": "https://arianee.net" },
      "android": { "native": "com.arianee.wallet", "universal": "https://arianee.net" },
    },
    "logo": "https://img1.depay.com/wallets/arianee_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "NOW Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "walletnow://", "universal": "https://walletnow.app.link" },
      "android": { "native": "walletnow://", "universal": "https://walletnow.app.link" },
    },
    "logo": "https://img1.depay.com/wallets/now_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Arculus Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "arculuswc:", "universal": "https://gw.arculus.co/app" },
      "android": { "native": "arculuswc:", "universal": "https://gw.arculus.co/app" },
    },
    "logo": "https://img1.depay.com/wallets/arculus_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Linen",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native":"linen:", "universal": "https://linen.app" },
      "android": { "native":"linen:", "universal": "https://linen.app" },
    },
    "logo": "https://img1.depay.com/wallets/linen.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Nitrogen Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://nitrogen.org/wc" },
      "android": { "universal": "https://nitrogen.org/wc" },
    },
    "logo": "https://img1.depay.com/wallets/nitrogen_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ApolloX",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://app.apollox.finance" },
      "android": { "universal": "https://app.apollox.finance" },
    },
    "logo": "https://img1.depay.com/wallets/apollo_x.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ID Pocket",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/id_pocket.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CoinCircle",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://coincircle.com/app/walletconnect" },
      "android": { "universal": "https://coincircle.com/app/walletconnect" },
    },
    "logo": "https://img1.depay.com/wallets/coin_circle.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SahalWallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/sahal_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "UPBOND Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/upbond_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Sequence Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://sequence.app" },
      "android": { "universal": "https://sequence.app" },
    },
    "logo": "https://img1.depay.com/wallets/sequence_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "LocalTrade Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://ws.lab.localtrade.cc" },
      "android": { "universal": "https://ws.lab.localtrade.cc" },
    },
    "logo": "https://img1.depay.com/wallets/local_trade_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Loopring Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/loopring_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Vision: Crypto Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://app.vision-crypto.com" },
      "android": { "universal": "https://app.vision-crypto.com" },
    },
    "logo": "https://img1.depay.com/wallets/vision.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ballet Crypto",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/ballet_crypto.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Pitaka",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "native": "pitaka://", "universal": "https://app.pitaka.io" },
      "android": { "native": "pitaka://", "universal": "https://app.pitaka.io" },
     },
    "logo": "https://img1.depay.com/wallets/pitaka.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "AbsoluteWallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/absolute_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "The Parallel",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/the_parallel.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CypherD Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/cypher_d_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Keplr",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/keplr.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "MyWalliD",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/my_walli_d.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Status",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/status.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Monarch Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://monarchwallet.com" },
      "android": { "universal": "https://monarchwallet.com" },
    },
    "logo": "https://img1.depay.com/wallets/monarch_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Marble",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://app.marblewallet.com/" },
      "android": { "universal": "https://app.marblewallet.com/" },
    },
    "logo": "https://img1.depay.com/wallets/marble.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Flooz",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://wallet.flooz.trade/wc" },
      "android": { "universal": "https://wallet.flooz.trade/wc" },
    },
    "logo": "https://img1.depay.com/wallets/flooz.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Blockchain.com",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://login.blockchain.com/deeplink/login/wallet-connect" },
      "android": { "universal": "https://login.blockchain.com/deeplink/login/wallet-connect" },
     },
    "logo": "https://img1.depay.com/wallets/blockchaincom.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Dohrnii Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/dohrnii_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "UniPass",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://wallet.unipass.id" },
      "android": { "universal": "https://wallet.unipass.id" },
     },
    "logo": "https://img1.depay.com/wallets/uni_pass.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ZenGo",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "native": "zengo:", "universal": "https://get.zengo.com" },
      "android": { "native": "zengo:", "universal": "https://get.zengo.com" },
     },
    "logo": "https://img1.depay.com/wallets/zengo.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Locker Token",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/locker_token.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Keeper",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://link.keeper-wallet.app" },
      "android": { "universal": "https://link.keeper-wallet.app" },
     },
    "logo": "https://img1.depay.com/wallets/keeper.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "XDEFI Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/xdefi_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Numio",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/numio.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Neon Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/neon_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Nabox",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://nabox.io/app/" },
      "android": { "universal": "https://nabox.io/app/" },
     },
    "logo": "https://img1.depay.com/wallets/nabox.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Snowball",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://app.snowball.exchange/app" },
      "android": { "universal": "https://app.snowball.exchange/app" },
     },
    "logo": "https://img1.depay.com/wallets/snowball.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "KryptoGO Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://kryptogo.page.link" },
      "android": { "universal": "https://kryptogo.page.link" },
     },
    "logo": "https://img1.depay.com/wallets/krypto_go_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Payperless",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/payperless.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Brave Wallet",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/brave_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Crossmint",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/crossmint.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Safematrix",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://safematrix.io/" },
      "android": { "universal": "https://safematrix.io/" },
     },
    "logo": "https://img1.depay.com/wallets/safematrix.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "pier",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://pierwallet.com/wc" },
      "android": { "universal": "https://pierwallet.com/wc" },
     },
    "logo": "https://img1.depay.com/wallets/pier.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "FILWallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://h5.filwallet.co" },
      "android": { "universal": "https://h5.filwallet.co" },
     },
    "logo": "https://img1.depay.com/wallets/fil_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ParaSwap Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://wallet.paraswap.io/#/" },
      "android": { "universal": "https://wallet.paraswap.io/#/" },
     },
    "logo": "https://img1.depay.com/wallets/para_swap_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bitski",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "native": "bitski:", "universal": "https://wallet.bitski.com/walletconnect/wc" },
      "android": { "native": "bitski:", "universal": "https://wallet.bitski.com/walletconnect/wc" },
     },
    "logo": "https://img1.depay.com/wallets/bitski.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Hippo Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "native": "hippowallet://", "universal": "https://hippowallet.io" },
      "android": { "native": "hippowallet://", "universal": "https://hippowallet.io" },
     },
    "logo": "https://img1.depay.com/wallets/hippo_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Core",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://core.app" },
      "android": { "universal": "https://core.app" },
     },
    "logo": "https://img1.depay.com/wallets/core.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Xcapit",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://app.xcapit.com/links" },
      "android": { "universal": "https://app.xcapit.com/links" },
     },
    "logo": "https://img1.depay.com/wallets/xcapit.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Paper",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://withpaper.com" },
      "android": { "universal": "https://withpaper.com" },
     },
    "logo": "https://img1.depay.com/wallets/paper_wallet.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "MetaOne",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "native": "metaone:" },
      "android": { "native": "metaone:" },
     },
    "logo": "https://img1.depay.com/wallets/metaone.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Enjin Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "native": "enjinwallet:", "universal": "https://deeplink.wallet.enjin.io" },
      "android": { "native": "enjinwallet:", "universal": "https://deeplink.wallet.enjin.io" },
     },
    "logo": "https://img1.depay.com/wallets/enjin.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BC Vault",
    "link": "WalletConnectV1",
    "logo": "https://img1.depay.com/wallets/bc_vault.jpg",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Wallet (Ethereum)",
    "extension": "WindowEthereum",
    "logo": wallets.WindowEthereum.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Wallet (Solana)",
    "extension": "WindowSolana",
    "logo": wallets.WindowSolana.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "WalletConnect",
    "link": "WalletConnectV1",
    "logo": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz48IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjUuNC4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAtLT48c3ZnIHZlcnNpb249JzEuMScgaWQ9J0xheWVyXzEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHg9JzBweCcgeT0nMHB4JyB2aWV3Qm94PScwIDAgNTAwIDUwMCcgc3R5bGU9J2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTAwIDUwMDsnIHhtbDpzcGFjZT0ncHJlc2VydmUnPjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+IC5zdDB7ZmlsbDojNTk5MUNEO30KPC9zdHlsZT48ZyBpZD0nUGFnZS0xJz48ZyBpZD0nd2FsbGV0Y29ubmVjdC1sb2dvLWFsdCc+PHBhdGggaWQ9J1dhbGxldENvbm5lY3QnIGNsYXNzPSdzdDAnIGQ9J00xMDIuNywxNjJjODEuNS03OS44LDIxMy42LTc5LjgsMjk1LjEsMGw5LjgsOS42YzQuMSw0LDQuMSwxMC41LDAsMTQuNEwzNzQsMjE4LjkgYy0yLDItNS4zLDItNy40LDBsLTEzLjUtMTMuMmMtNTYuOC01NS43LTE0OS01NS43LTIwNS44LDBsLTE0LjUsMTQuMWMtMiwyLTUuMywyLTcuNCwwTDkxLjksMTg3Yy00LjEtNC00LjEtMTAuNSwwLTE0LjQgTDEwMi43LDE2MnogTTQ2Ny4xLDIyOS45bDI5LjksMjkuMmM0LjEsNCw0LjEsMTAuNSwwLDE0LjRMMzYyLjMsNDA1LjRjLTQuMSw0LTEwLjcsNC0xNC44LDBjMCwwLDAsMCwwLDBMMjUyLDMxMS45IGMtMS0xLTIuNy0xLTMuNywwaDBsLTk1LjUsOTMuNWMtNC4xLDQtMTAuNyw0LTE0LjgsMGMwLDAsMCwwLDAsMEwzLjQsMjczLjZjLTQuMS00LTQuMS0xMC41LDAtMTQuNGwyOS45LTI5LjIgYzQuMS00LDEwLjctNCwxNC44LDBsOTUuNSw5My41YzEsMSwyLjcsMSwzLjcsMGMwLDAsMCwwLDAsMGw5NS41LTkzLjVjNC4xLTQsMTAuNy00LDE0LjgsMGMwLDAsMCwwLDAsMGw5NS41LDkzLjUgYzEsMSwyLjcsMSwzLjcsMGw5NS41LTkzLjVDNDU2LjQsMjI1LjksNDYzLDIyNS45LDQ2Ny4xLDIyOS45eicvPjwvZz48L2c+PC9zdmc+Cg==",
    "blockchains": [...supported.evm]
  },
].filter((wallet)=>wallet.blockchains.filter(Boolean).length > 0)
