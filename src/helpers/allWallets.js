/*#if _EVM

import { wallets } from '@depay/web3-wallets-evm'

/*#elif _SVM

import { wallets } from '@depay/web3-wallets-svm'

//#else */

import { wallets } from '@depay/web3-wallets'

//#endif

import Blockchains from '@depay/web3-blockchains'
import { supported } from '../blockchains'

export default [
  {
    "name": "Coinbase",
    "extensions": ["CoinbaseEVM", "CoinbaseSVM"],
    "desktop": { "qr": "WalletLink" },
    "mobile": { 
      "ios": { "native": "cbwallet://dapp", "universal": "https://go.cb-w.com/dapp", "open": ()=>`cbwallet://dapp?url=${encodeURIComponent(window.location.toString())}` },
      "android": { "native": "cbwallet://dapp", "universal": "https://go.cb-w.com/dapp", "open": ()=>`https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.toString())}` },
    },
    "logo": wallets.CoinbaseEVM?.info?.logo,
    "blockchains": [...supported],
    "colors": { "primary": "#0153ff", "secondary": "#ffffff" }
  },
  {
    "name": "MetaMask",
    "extension": "MetaMask",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "metamask:", "universal": "https://metamask.app.link", "qr": "WalletConnectV2", "connect":"WalletConnectV2" },
      "android": { "native": "metamask:", "universal": "https://metamask.app.link", "qr": "WalletConnectV2", "connect":"WalletConnectV2" },
    },
    "logo": wallets.MetaMask?.info?.logo,
    "blockchains": [...supported.evm],
    "colors": { "primary": "#ff9264", "secondary": "#531502" }
  },
  {
    "name": "Phantom",
    "extensions": ["PhantomSVM", "PhantomEVM"],
    "desktop": {
      "solanaPay": true,
      "qr": ()=>`phantom://browse/${encodeURIComponent(window.location.toString())}?ref=${encodeURIComponent(window.location.origin.toString())}`
    },
    "mobile": {
      "ios": {
        "native": "phantom:",
        "open": ()=>`phantom://ul/browse/${encodeURIComponent(window.location.toString())}?ref=${encodeURIComponent(window.location.origin.toString())}`,
        "qr": ()=>`phantom://browse/${encodeURIComponent(window.location.toString())}?ref=${encodeURIComponent(window.location.origin.toString())}`,
        "solanaPay": true,
      },
      "android": {
        "native": "phantom:",
        "connect": "SolanaMobileWalletAdapter",
        "qr": ()=>`phantom://browse/${encodeURIComponent(window.location.toString())}?ref=${encodeURIComponent(window.location.origin.toString())}`,
        "solanaPay": true,
      },
    },
    "logo": wallets.PhantomSVM?.info?.logo,
    "blockchains": [...supported],
    "colors": { "primary": "#ab9ef2", "secondary": "#252525", "background": "#252525" }
  },
  {
    "name": "Trust",
    "extensions": ["TrustEVM", "TrustSVM"],
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "trust:", "universal": "https://link.trustwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "trust:", "universal": "https://link.trustwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": wallets.TrustEVM?.info?.logo,
    "blockchains": [...supported],
    "colors": { "primary": "#0700ff", "secondary": "#48ff91", "background": "#ffffff" }
  },
  {
    "name": "Binance",
    "extension": "Binance",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bnc://app.binance.com/cedefi/", "universal": "https://app.binance.com/cedefi", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bnc://app.binance.com/cedefi/", "universal": "https://app.binance.com/cedefi", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": wallets.Binance?.info?.logo,
    "blockchains": [...supported.evm],
    "colors": { "primary": "#1e2024", "secondary": "#f3ba2f" }
  },
  {
    "name": "Crypto.com Onchain",
    "extension": "CryptoCom",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "dfw://", "universal": "https://wallet.crypto.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "dfw://", "universal": "https://wallet.crypto.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": wallets.CryptoCom?.info?.logo,
    "blockchains": [...supported.evm],
    "colors": { "primary": "#03316c", "secondary": "#ffffff", "background": "#245594" }
  },
  {
    "name": "World App",
    "extension": "WorldApp",
    "logo": wallets.WorldApp?.info?.logo,
    "autoSelect": true, // if available
    "blockchains": ["worldchain"],
    "colors": { "primary": "#000000", "secondary": "#ffffff" }
  },
  {
    "name": "Coin98",
    "extensions": ["Coin98EVM", "Coin98SVM"],
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "coin98:", "universal": "https://coin98.services", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "coin98:", "universal": "https://coin98.services", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": wallets.Coin98EVM?.info?.logo,
    "blockchains": [...supported],
    "colors": { "primary": "#252525", "secondary": "#d9b432" }
  },
  {
    "name": "Brave",
    "extensions": ["BraveEVM", "BraveSVM"],
    "logo": wallets.BraveEVM?.info?.logo,
    "blockchains": [...supported],
    "colors": { "primary": "#ffffff", "secondary": "#f05a22" }
  },
  {
    "name": "Magic Eden",
    "extensions": ["MagicEdenEVM", "MagicEdenSVM"],
    "logo": wallets.MagicEdenEVM?.info?.logo,
    "blockchains": [...supported],
    "colors": { "primary": "#070c34", "secondary": "#ff8c00" }
  },
  {
    "name": "Rainbow",
    "extension": "Rainbow",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "rainbow:", "universal": "https://rnbwapp.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "rainbow:", "universal": "https://rnbwapp.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/rainbow.jpg",
    "blockchains": [...supported.evm],
    "colors": { "primary": "#092b70", "secondary": "#ffde01" }
  },
  {
    "name": "Uniswap",
    "extension": "Uniswap",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "uniswap:", "universal": "https://uniswap.org/app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "uniswap:", "universal": "https://uniswap.org/app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/uniswap_wallet.jpg",
    "blockchains": [...supported.evm],
    "colors": { "primary": "#fffbfe", "secondary": "#f43ddf" }
  },
  {
    "name": "Safe",
    "desktop": { "qr": "WalletConnectV2", "copyLink": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "safe", "universal": "https://app.safe.global", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "safe", "universal": "https://app.safe.global", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/safe.jpg",
    "blockchains": [...supported.evm],
    "colors": { "primary": "#10ff80", "secondary": "#121312" }
  },
  {
    "name": "Rabby",
    "extension": "Rabby",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": wallets.Rabby?.info?.logo,
    "blockchains": [...supported.evm],
    "colors": { "primary": "#5c48ed", "secondary": "#a6a6ff" }
  },
  {
    "name": "Kraken",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "krakenwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "krakenwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/kraken.jpg",
    "blockchains": [...supported.evm],
    "colors": { "primary": "#7a3ef5", "secondary": "#f3cefc" }
  },
  {
    "name": "Backpack",
    "extension": "Backpack",
    "desktop": {
      "solanaPay": true,
      "qr": ()=>`backpack://ul/v1/browse/${encodeURIComponent(window.location.toString())}?ref=${encodeURIComponent(window.location.origin.toString())}`
    },
    "mobile": {
      "ios": {
        "open": ()=>`backpack://ul/v1/browse/${encodeURIComponent(window.location.toString())}?ref=${encodeURIComponent(window.location.origin.toString())}`,
      },
      "android": {
        "open": ()=>`backpack://ul/v1/browse/${encodeURIComponent(window.location.toString())}?ref=${encodeURIComponent(window.location.origin.toString())}`,
      },
    },
    "logo": wallets.Backpack?.info?.logo,
    "blockchains": [...supported.svm],
    "colors": { "primary": "#e23e3f", "secondary": "#252525", "background": "#252525" }
  },
  {
    "name": "Glow",
    "extension": "Glow",
    "desktop": {
      "qr": ()=>window.location.toString(),
    },
    "mobile": {
      "ios": {
        "qr": ()=>window.location.toString(),
      },
      "android": {
        "connect": "SolanaMobileWalletAdapter",
        "qr": ()=>window.location.toString(),
      },
    },
    "logo": wallets.Glow?.info?.logo,
    "blockchains": [...supported.svm],
    "colors": { "primary": "#aa35d8", "secondary": "#f5e4fb" }
  },
  {
    "name": "Solflare",
    "extension": "Solflare",
    "desktop": {
      "solanaPay": true,
    },
    "mobile": {
      "ios": {
        "native": "solflare:",
        "open": ()=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(window.location.toString())}?ref=${encodeURIComponent(window.location.origin.toString())}`,
        "universal": "https://solflare.com/ul",
        "solanaPay": true,
      },
      "android": {
        "native": "solflare:",
        "universal": "https://solflare.com/ul",
        "connect": "SolanaMobileWalletAdapter",
        "solanaPay": true,
      },
    },
    "logo": wallets.Solflare?.info?.logo,
    "blockchains": [...supported.svm],
    "colors": { "primary": "#fef046", "secondary": "#03050b" }
  },
  {
    "name": "Family",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "familywallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "familywallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/family.jpg",
    "blockchains": [...supported.evm],
    "colors": { "primary": "#12bec1", "secondary": "#d7f3ff" }
  },
  {
    "name": "imToken",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "imtokenv2:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "imtokenv2:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/imtoken.jpg",
    "blockchains": [...supported.evm],
    "colors": { "primary": "#037ab6", "secondary": "#ffffff" }
  },
  {
    "name": "MEW wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "mewwallet:" , "universal": "https://mewwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "mewwallet:" , "universal": "https://mewwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/mew_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ONTO",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "ontoprovider:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "ontoprovider:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/onto.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Zerion",
    "desktop": { "native": "zerion://", "qr": "WalletConnectV2", "connect": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "zerion://", "universal": "https://wallet.zerion.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "zerion://", "universal": "https://wallet.zerion.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/zerion.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Spot",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "spot://", "universal": "https://spot.so", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "spot://", "universal": "https://spot.so", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/spot.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "BitGet (BitKeep)",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bitget://", "universal": "https://bkapp.vip", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bitget://", "universal": "https://bkapp.vip", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/bitget.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Unstoppable Domains",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "universal": "https://unstoppabledomains.com/mobile", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://unstoppabledomains.com/mobile", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/unstoppable_domains.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Omni",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "omni:", "universal": "https://links.omni.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "omni:", "universal": "https://links.omni.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/omni.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "KEYRING PRO",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "keyring:", "universal": "https://keyring.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "keyring:", "universal": "https://keyring.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/keyring_pro.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "TP Wallet (TokenPocket)",
    "extension": "TokenPocket",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "tpoutside:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "tpoutside:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/token_pocket.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "BitPay",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bitpay:", "universal": "https://link.bitpay.com/wallet", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bitpay:", "universal": "https://link.bitpay.com/wallet", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/bitpay.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "MathWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "mathwallet:", "universal": "https://www.mathwallet.org", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "mathwallet:", "universal": "https://www.mathwallet.org", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/math_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Ledger Live",
    "desktop": { "native": "ledgerlive:", "connect": "WalletConnectV2", "qr": "WalletConnectV2", "copyLink": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "ledgerlive:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "ledgerlive:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/ledger_live.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "1inch Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "oneinch://", "universal": "https://wallet.1inch.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "oneinch://", "universal": "https://wallet.1inch.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/1inch_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "iToken Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "huobiwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "huobiwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/i_token_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Huddln",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "huddln:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "huddln:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/huddln.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Eidoo",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "eidoo:", "universal": "https://eidoo.io/crypto-wallet", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "eidoo:", "universal": "https://eidoo.io/crypto-wallet", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/eidoo.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Timeless Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "timeless-wallet:", "universal": "https://timelesswallet.xyz", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "timeless-wallet:", "universal": "https://timelesswallet.xyz", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/timeless.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "CoolWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "coolwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "coolwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/cool_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Unstoppable Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "universal": "unstoppable.money://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "unstoppable.money://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/unstoppable.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "AlphaWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "awallet:", "universal": "https://aw.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "awallet:", "universal": "https://aw.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/alpha_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Pillar",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "pillarwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "pillarwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/pillar.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "D'CENT Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "dcent:", "universal": "https://link.dcentwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "dcent:", "universal": "https://link.dcentwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/dcent.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ZelCore",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "zel:", "universal": "https://link.zel.network", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "zel:", "universal": "https://link.zel.network", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/zel_core.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Nash",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "nash:", "universal": "https://nash.io/walletconnect", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "nash:", "universal": "https://nash.io/walletconnect", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/nash.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Coinomi",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "universal": "https://coinomi.page.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://coinomi.page.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/coinomi.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "CYBAVO Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "cybavowallet:", "universal": "https://cdn.cybavo.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "cybavowallet:", "universal": "https://cdn.cybavo.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/cybavo.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Tokenary",
    "desktop": { "native": "tokenary:", "universal": "https://tokenary.io", "connect": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/tokenary.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Torus",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/torus.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "SafePal",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "safepalwallet", "universal": "https://link.safepal.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "safepalwallet", "universal": "https://link.safepal.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/safepal.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Infinity Wallet",
    "desktop": { "native": "infinity:", "universal": "https://infinitywallet.io/", "connect": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/infinity_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Bridge Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bridgewallet:", "universal": "https://bridge.mtpelerin.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bridgewallet:", "universal": "https://bridge.mtpelerin.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/mtperlin.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "SparkPoint",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "sparkpoint:", "universal": "https://sparkpoint.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "sparkpoint:", "universal": "https://sparkpoint.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/sparkpoint.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "PEAKDEFI Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "peakdefiwallet:", "universal": "https://peakdefi.com/download", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "peakdefiwallet:", "universal": "https://peakdefi.com/download", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/peakdefi.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "AT.Wallet",
    "desktop": { "native": "atwallet:", "qr": "WalletConnectV2", "connect": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "atwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "atwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/atwallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Ellipal",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "ellipal:", "universal": "https://www.ellipal.com/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "ellipal:", "universal": "https://www.ellipal.com/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/ellipal.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Aktionariat",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "aktionariat:", "universal": "https://app.aktionariat.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "aktionariat:", "universal": "https://app.aktionariat.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/aktionariat.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Talken Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "talken-wallet:", "universal": "https://talken.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "talken-wallet:", "universal": "https://talken.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/talken.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "KyberSwap",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "kyberswap:", "universal": "https://kyberswapnew.app.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "kyberswap:", "universal": "https://kyberswapnew.app.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/kyberswap.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Tongue Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "tongue:", "universal": "https://www.tongue.fi", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "tongue:", "universal": "https://www.tongue.fi", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/tongue.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "RWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "rwallet:", "universal": "https://www.rwallet.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "rwallet:", "universal": "https://www.rwallet.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/rwallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "O3Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "o3wallet:", "universal": "https://o3.network", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "o3wallet:", "universal": "https://o3.network", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/o3wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "HashKey Me",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "hashme:", "universal": "https://me.hashkey.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "hashme:", "universal": "https://me.hashkey.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/hashkeyme.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Guarda Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/guarda.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Defiant",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "defiantapp:", "universal": "https://defiantapp.tech", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "defiantapp:", "universal": "https://defiantapp.tech", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/defiant.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Valora",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "celo://wallet", "universal": "https://valoraapp.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "celo://wallet", "universal": "https://valoraapp.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/valora.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Celo Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "celowallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "celowallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/celo.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Elastos Essentials",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "essentials:", "universal": "https://essentials.elastos.net", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "essentials:", "universal": "https://essentials.elastos.net", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/elastos_essentials.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Stasis",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "stasis:", "universal": "https://app.stasis.net", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "stasis:", "universal": "https://app.stasis.net", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/stasis.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "JulWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "julwallet:", "universal": "https://justliquidity.org", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "julwallet:", "universal": "https://justliquidity.org", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/julwallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Bitpie",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bitpie:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bitpie:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/bitpie.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Minerva Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "minerva:", "universal": "https://minerva.digital", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "minerva:", "universal": "https://minerva.digital", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/minerva.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Tangem",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "tangem:", "universal": "https://app.tangem.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "tangem:", "universal": "https://app.tangem.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/tangem.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ioPay",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "iopay:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "iopay:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/io_pay.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Coinhub",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/coinhub.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Go Pocket",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/gopocket.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Wallet 3",
    "desktop": { "native": "wallet3:", "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "wallet3:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "wallet3:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/wallet3.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "yiToken",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "yitoken:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "yitoken:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/yitoken.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "DID Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "abt:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "abt:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/didwallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Shinobi Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "shinobi-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "shinobi-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/shinobi_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "AirGap Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "airgap-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "airgap-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/air_gap_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "SecuX",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "secux://", "universal": "https://wsweb.secuxtech.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "secux://", "universal": "https://wsweb.secuxtech.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/secux.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Orange",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "orangewallet:", "universal": "https://link.orangewallet.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "orangewallet:", "universal": "https://link.orangewallet.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/orange.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Krystal",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "krystalWallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "krystalWallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/krystal.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Kriptomat",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "kriptomatapp://wallet-connect", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "kriptomatapp://wallet-connect", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/kriptomat.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Ambire Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "ambire:", "universal": "https://mobile.ambire.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "ambire:", "universal": "https://mobile.ambire.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/ambire_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "PayBolt",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "paybolt://Wallet", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "paybolt://Wallet", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/pay_bolt.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "OKX",
    "extensions": ["OKXEVM", "OKXSVM"],
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "okex://main", "connect": "WalletConnectV2", "qr": "WalletConnectV2", "open": ()=>`okx://wallet/dapp/url?dappUrl=${encodeURIComponent(window.location.toString())}` },
      "android": { "native": "okex://main", "connect": "WalletConnectV2", "qr": "WalletConnectV2", "open": ()=>`okx://wallet/dapp/url?dappUrl=${encodeURIComponent(window.location.toString())}` },
    },
    "logo": wallets.OKXEVM?.info?.logo,
    "blockchains": [...supported.evm],
  },
  {
    "name": "Mask Network",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/mask_network.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Uniblow",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/uniblow.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Autonomy: Digital Art Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "autonomy-wc", "universal": "https://autonomy.io/apps/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "autonomy-wc", "universal": "https://autonomy.io/apps/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/autonomy.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Lilico",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "lilico://", "universal": "https://link.lilico.app/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "lilico://", "universal": "https://link.lilico.app/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/lilico.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Fireblocks",
    "desktop": { "universal": "https://console.fireblocks.io/v2", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "fireblocks-wc://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "fireblocks-wc://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/fireblocks.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "WATT ME",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "wattwallet://wallet-connect/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "wattwallet://wallet-connect/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/wattme.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Coingrig",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "coingrig://", "universal": "https://link.coingrig.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "coingrig://", "universal": "https://link.coingrig.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/coingrig.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Cryptnox Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/cryptnox_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "bobablocks",
    "desktop": { "native": "bobablocks://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bobablocks://", "universal": "https://app.bobablocks.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bobablocks://", "universal": "https://app.bobablocks.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/bobablocks.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Plasma Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "plasmawallet:", "universal": "https://plasma-wallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "plasmawallet:", "universal": "https://plasma-wallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/plasma_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "HUMBL WALLET",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "humblwallet:", "universal": "https://wallet.search3.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "humblwallet:", "universal": "https://wallet.search3.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/humbl_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Zelus",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "zeluswallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "zeluswallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/zelus.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Earth Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "earthwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "earthwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/earth_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Boba Multisig",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/boba_multisig.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "EASY",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "co.theeasy.app://", "universal": "https://link.easy.me", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "co.theeasy.app://", "universal": "https://link.easy.me", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/easy.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ISLAMIwallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "islamiwallet://islami.com/path/", "universal": "https://islamiwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "islamiwallet://islami.com/path/", "universal": "https://islamiwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/islam_iwallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Card Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "cardwallet://", "universal": "https://wallet.cardstack.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "cardwallet://", "universal": "https://wallet.cardstack.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/card_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "GameStop Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/game_stop_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "RealT Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/real_t_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "PLTwallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "pltwallet:", "universal": "https://pltwallet.io/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "pltwallet:", "universal": "https://pltwallet.io/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/pl_twallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Avacus",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "avacus://", "universal": "https://avacus.app.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "avacus://", "universal": "https://avacus.app.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/avacus.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "StrikeX Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "strikex://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "strikex://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/strike_x_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "BCERTin wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/bcer_tin_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Edge Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "edge://", "universal": "https://deep.edge.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "edge://", "universal": "https://deep.edge.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/edge_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Freedom Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "freedom-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "freedom-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/freedom_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Assure",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "assure://", "universal": "https://www.assure.pro/Official", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "assure://", "universal": "https://www.assure.pro/Official", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/assure.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Cosmostation",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "cosmostation://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "cosmostation://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/cosmostation.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "THORWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "thorwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "thorwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/thor_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Gryfyn",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/gryfyn.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "CoinStats",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "coinstats:", "universal": "https://coinstats.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "coinstats:", "universal": "https://coinstats.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/coin_stats.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Abra Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "abra:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "abra:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/abra_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Opera Crypto Browser",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "cryptobrowser://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "cryptobrowser://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/opera_crypto_browser.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Keywallet Touch",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "keywalletTouch://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "keywalletTouch://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/keywallet_touch.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Enno Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "ennowallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "ennowallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/enno_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "A4 Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/a4_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Bitcoin.com Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bitcoincom://", "universal": "https://wallet.bitcoin.com/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bitcoincom://", "universal": "https://wallet.bitcoin.com/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/bitcoincom.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Defiant",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "defiantapp://", "universal": "https://defiantapp.tech/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "defiantapp://", "universal": "https://defiantapp.tech/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/defiant.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Chain",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/chain.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Verso",
    "desktop": { "native": "verso", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "verso", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "verso", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/verso.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "LOBSTR Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "lobstr://", "universal": "https://lobstr.co/uni/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "lobstr://", "universal": "https://lobstr.co/uni/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/lobstr_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Bifrost Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bifrostwallet:", "universal": "https://app.bifrostwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bifrostwallet:", "universal": "https://app.bifrostwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/bifrost_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Okse Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "oksewallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "oksewallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/okse_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "BRISE Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/brise_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "HyperPay",
    "extension": "HyperPay",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": wallets.HyperPay?.info?.logo,
    "blockchains": [...supported.evm],
  },
  {
    "name": "ATON",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/aton.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Frontier",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "frontier://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "frontier://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/frontier.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "MDAO Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "ttmwalletapp://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "ttmwalletapp://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/mdao_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "TTM Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "ttmwalletapp:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "ttmwalletapp:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/ttm_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Opto Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "opto://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "opto://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/opto_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "XFUN Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "xfunwallet://", "universal": "https://xfun.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "xfunwallet://", "universal": "https://xfun.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/xfun_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Exodus",
    "extensions": ["ExodusEVM", "ExodusSVM"],
    "desktop": { "native": "exodus://", "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "exodus://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "exodus://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/exodus.jpg",
    "blockchains": [...supported],
  },
  {
    "name": "Uvtoken",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "UvToken://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "UvToken://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/uv_token.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "PREMA Wallet",
    "desktop": { "native": "premawallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "premawallet:", "universal": "https://premanft.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "premawallet:", "universal": "https://premanft.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/prema_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Shinobi-Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "shinobi-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "shinobi-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/shinobi.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ByteBank",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "hideoutWallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "hideoutWallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/byte_bank.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Ancrypto Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "ancrypto://app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "ancrypto://app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/ancrypto_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Bee Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "beewallet.app://", "universal": "https://beewallet.app/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "beewallet.app://", "universal": "https://beewallet.app/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/bee_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "LATOKEN Multichain DeFi Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "dfwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "dfwallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/latoken_multichain_de_fi_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "TK Finance",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "tk://", "universal": "https://trustkeys.network", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "tk://", "universal": "https://trustkeys.network", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/tk_finance.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Oxalus Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "oxalus://", "universal": "https://deeplink.oxalus.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "oxalus://", "universal": "https://deeplink.oxalus.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/oxalus_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "3S Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bhcwallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bhcwallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/3_s_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Klever Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "kleverwallet:", "universal": "https://klever.page.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "kleverwallet:", "universal": "https://klever.page.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/klever_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "OneKey",
    "desktop": { "native": "onekey-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "onekey-wallet://", "universal": "https://app.onekey.so/wc/connect", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "onekey-wallet://", "universal": "https://app.onekey.so/wc/connect", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/one_key.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "helix id",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "helix-id://helix-id.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "helix-id://helix-id.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/helix_id.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ABC Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "abc-wallet://abcwc", "universal": "https://abcwalletconnect.page.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "abc-wallet://abcwc", "universal": "https://abcwalletconnect.page.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/abcwallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "HaHa",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "haha://", "universal": "https://haha.me", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "haha://", "universal": "https://haha.me", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/haha.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Volt: DeFi",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "volt:", "universal": "https://get.voltage.finance", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "volt:", "universal": "https://get.voltage.finance", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/volt.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Robinhood Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "robinhood-wallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "robinhood-wallet:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/robinhood_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "RiceWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "ricewallet", "universal": "https://ricewallet.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "ricewallet", "universal": "https://ricewallet.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/rice_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "SafeMoon",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "safemoon:", "universal": "https://safemoon.net/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "safemoon:", "universal": "https://safemoon.net/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/safemoon.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "SimpleHold",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "simplehold://", "universal": "https://simplehold.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "simplehold://", "universal": "https://simplehold.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/simple_hold.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "GoldBit",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "goldbit://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "goldbit://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/gold_bit.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ioPay",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "iopay:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "iopay:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/iopay.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Bitizen",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "bitizen://wallet", "universal": "https://bitizen.org/wallet", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bitizen://wallet", "universal": "https://bitizen.org/wallet", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/bitizen.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Slavi Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "slaviwallet:", "universal": "https://www.slaviwallet.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "slaviwallet:", "universal": "https://www.slaviwallet.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/slavi_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Nufinetes",
    "desktop": { "native": "vimwallet:/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "vimwallet:/", "universal": "https://apple.vimworld.org", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "vimwallet:/", "universal": "https://apple.vimworld.org", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/nufinetes.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Arianee Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "com.arianee.wallet", "universal": "https://arianee.net", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "com.arianee.wallet", "universal": "https://arianee.net", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/arianee_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "NOW Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "walletnow://", "universal": "https://walletnow.app.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "walletnow://", "universal": "https://walletnow.app.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/now_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Arculus Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native": "arculuswc:", "universal": "https://gw.arculus.co/app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "arculuswc:", "universal": "https://gw.arculus.co/app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/arculus_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Linen",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "native":"linen:", "universal": "https://linen.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native":"linen:", "universal": "https://linen.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/linen.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Nitrogen Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "universal": "https://nitrogen.org/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://nitrogen.org/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/nitrogen_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ApolloX",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "universal": "https://app.apollox.finance", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://app.apollox.finance", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/apollo_x.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ID Pocket",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/id_pocket.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "CoinCircle",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "universal": "https://coincircle.com/app/walletconnect", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://coincircle.com/app/walletconnect", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/coin_circle.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "SahalWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/sahal_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "UPBOND Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/upbond_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Sequence Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "universal": "https://sequence.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://sequence.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/sequence_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "LocalTrade Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "universal": "https://ws.lab.localtrade.cc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://ws.lab.localtrade.cc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/local_trade_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Loopring Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/loopring_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Vision: Crypto Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": { 
      "ios": { "universal": "https://app.vision-crypto.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://app.vision-crypto.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/vision.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Ballet Crypto",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/ballet_crypto.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Pitaka",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "native": "pitaka://", "universal": "https://app.pitaka.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "pitaka://", "universal": "https://app.pitaka.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/pitaka.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "AbsoluteWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/absolute_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "The Parallel",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/the_parallel.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "CypherD Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/cypher_d_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Keplr",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/keplr.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "MyWalliD",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/my_walli_d.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Status",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/status.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Monarch Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://monarchwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://monarchwallet.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/monarch_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Marble",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://app.marblewallet.com/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://app.marblewallet.com/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/marble.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Flooz",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://wallet.flooz.trade/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://wallet.flooz.trade/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
    },
    "logo": "https://img1.depay.com/wallets/flooz.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Blockchain.com",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "native": "blockchain-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "blockchain-wallet://", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/blockchaincom.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Dohrnii Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/dohrnii_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "UniPass",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://wallet.unipass.id", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://wallet.unipass.id", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/uni_pass.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ZenGo",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "native": "zengo://get.zengo.com/", "universal": "https://get.zengo.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "zengo://get.zengo.com/", "universal": "https://get.zengo.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/zengo2.png",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Locker Token",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/locker_token.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Keeper",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://link.keeper-wallet.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://link.keeper-wallet.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/keeper.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "XDEFI Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/xdefi_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Numio",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/numio.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Neon Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/neon_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Nabox",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://nabox.io/app/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://nabox.io/app/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/nabox.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Snowball",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://app.snowball.exchange/app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://app.snowball.exchange/app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/snowball.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "KryptoGO Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://kryptogo.page.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://kryptogo.page.link", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/krypto_go_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Payperless",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/payperless.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Brave Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/brave_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Crossmint",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/crossmint.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Safematrix",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://safematrix.io/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://safematrix.io/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/safematrix.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "pier",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://pierwallet.com/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://pierwallet.com/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/pier.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "FILWallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://h5.filwallet.co", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://h5.filwallet.co", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/fil_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "ParaSwap Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://wallet.paraswap.io/#/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://wallet.paraswap.io/#/", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/para_swap_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Bitski",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "native": "bitski:", "universal": "https://wallet.bitski.com/walletconnect/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "bitski:", "universal": "https://wallet.bitski.com/walletconnect/wc", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/bitski.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Hippo Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "native": "hippowallet://", "universal": "https://hippowallet.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "hippowallet://", "universal": "https://hippowallet.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/hippo_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Core",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://core.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://core.app", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/core.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Xcapit",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://app.xcapit.com/links", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://app.xcapit.com/links", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/xcapit.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Paper",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "universal": "https://withpaper.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "universal": "https://withpaper.com", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/paper_wallet.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "MetaOne",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "native": "metaone:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "metaone:", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/metaone.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Enjin Wallet",
    "desktop": { "qr": "WalletConnectV2" },
    "mobile": {
      "ios": { "native": "enjinwallet:", "universal": "https://deeplink.wallet.enjin.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
      "android": { "native": "enjinwallet:", "universal": "https://deeplink.wallet.enjin.io", "connect": "WalletConnectV2", "qr": "WalletConnectV2" },
     },
    "logo": "https://img1.depay.com/wallets/enjin.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "BC Vault",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "https://img1.depay.com/wallets/bc_vault.jpg",
    "blockchains": [...supported.evm],
  },
  {
    "name": "Ethereum Wallet",
    "extension": "WindowEthereum",
    "logo": wallets.WindowEthereum?.info?.logo,
    "blockchains": [...supported.evm],
  },
  {
    "name": "Solana Pay",
    "desktop": {
      "solanaPay": true
    },
    "mobile": {
      "ios": {
        "solanaPay": true
      },
      "android": {
        "solanaPay": true
      }
    },
    "logo": Blockchains.solana?.logo,
    "blockchains": [...supported.svm],
  },
  {
    "name": "Solana Wallet",
    "extension": "WindowSolana",
    "desktop": {
      "solanaPay": true
    },
    "mobile": {
      "ios": {
        "solanaPay": true
      },
      "android": {
        "solanaPay": true
      }
    },
    "logo": wallets.WindowSolana?.info?.logo,
    "blockchains": [...supported.svm],
  },
  {
    "name": "WalletConnect",
    "desktop": { "qr": "WalletConnectV2" },
    "logo": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz48IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjUuNC4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAtLT48c3ZnIHZlcnNpb249JzEuMScgaWQ9J0xheWVyXzEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHg9JzBweCcgeT0nMHB4JyB2aWV3Qm94PScwIDAgNTAwIDUwMCcgc3R5bGU9J2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTAwIDUwMDsnIHhtbDpzcGFjZT0ncHJlc2VydmUnPjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+IC5zdDB7ZmlsbDojNTk5MUNEO30KPC9zdHlsZT48ZyBpZD0nUGFnZS0xJz48ZyBpZD0nd2FsbGV0Y29ubmVjdC1sb2dvLWFsdCc+PHBhdGggaWQ9J1dhbGxldENvbm5lY3QnIGNsYXNzPSdzdDAnIGQ9J00xMDIuNywxNjJjODEuNS03OS44LDIxMy42LTc5LjgsMjk1LjEsMGw5LjgsOS42YzQuMSw0LDQuMSwxMC41LDAsMTQuNEwzNzQsMjE4LjkgYy0yLDItNS4zLDItNy40LDBsLTEzLjUtMTMuMmMtNTYuOC01NS43LTE0OS01NS43LTIwNS44LDBsLTE0LjUsMTQuMWMtMiwyLTUuMywyLTcuNCwwTDkxLjksMTg3Yy00LjEtNC00LjEtMTAuNSwwLTE0LjQgTDEwMi43LDE2MnogTTQ2Ny4xLDIyOS45bDI5LjksMjkuMmM0LjEsNCw0LjEsMTAuNSwwLDE0LjRMMzYyLjMsNDA1LjRjLTQuMSw0LTEwLjcsNC0xNC44LDBjMCwwLDAsMCwwLDBMMjUyLDMxMS45IGMtMS0xLTIuNy0xLTMuNywwaDBsLTk1LjUsOTMuNWMtNC4xLDQtMTAuNyw0LTE0LjgsMGMwLDAsMCwwLDAsMEwzLjQsMjczLjZjLTQuMS00LTQuMS0xMC41LDAtMTQuNGwyOS45LTI5LjIgYzQuMS00LDEwLjctNCwxNC44LDBsOTUuNSw5My41YzEsMSwyLjcsMSwzLjcsMGMwLDAsMCwwLDAsMGw5NS41LTkzLjVjNC4xLTQsMTAuNy00LDE0LjgsMGMwLDAsMCwwLDAsMGw5NS41LDkzLjUgYzEsMSwyLjcsMSwzLjcsMGw5NS41LTkzLjVDNDU2LjQsMjI1LjksNDYzLDIyNS45LDQ2Ny4xLDIyOS45eicvPjwvZz48L2c+PC9zdmc+Cg==",
    "blockchains": [...supported.evm],
  },
].filter((wallet)=>wallet.blockchains.filter(Boolean).length > 0)
