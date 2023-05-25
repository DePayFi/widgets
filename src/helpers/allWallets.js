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
      "ios": { "native": "cryptowallet:", "universal": "https://wallet.crypto.com" },
      "android": { "native": "wc:", "universal": "https://wallet.crypto.com" },
    },
    "logo": wallets.CryptoCom.info.logo,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Coin98",
    "extension": "Coin98",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "coin98:", "universal": "https://coin98.com" },
      "android": { "native": "coin98:", "universal": "https://coin98.com" },
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/7a33d7f1-3d12-4b5c-f3ee-5cd83cb1b500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Uniswap Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://uniswap.org/app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/bff9cf1f-df19-42ce-f62a-87f04df13c00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Safe",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "gnosissafe:", "universal": "https://gnosis-safe.io/" },
      "android": { "native": "gnosissafe:", "universal": "https://gnosis-safe.io/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a1cb2777-f8f9-49b0-53fd-443d20ee0b00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/1991f85d-43d4-4165-3502-cd6ef8312b00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "MEW wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://mewwallet.com" },
      "android": { "universal": "https://mewwallet.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/e2024511-2c9b-46d7-3111-52df3d241700?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ONTO",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ontoprovider:" },
      "android": { "native": "ontoprovider:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/d22b2a4b-5562-49ba-506b-6d5986914600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f216b371-96cf-409a-9d88-296392b85800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Spot",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "spot://", "universal": "https://spot.so" },
      "android": { "native": "spot://", "universal": "https://spot.so" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/1bf33a89-b049-4a1c-d1f6-4dd7419ee400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BitKeep",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitkeep://", "universal": "https://bkapp.vip" },
      "android": { "native": "bitkeep://", "universal": "https://bkapp.vip" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3f7075d0-4ab7-4db5-404d-3e4c05e6fe00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Unstoppable Domains",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://unstoppabledomains.com/mobile" },
      "android": { "universal": "https://unstoppabledomains.com/mobile" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/4725dda0-4471-4d0f-7adf-6bbe8b929c00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Omni",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "omni", "universal": "https://links.omni.app" },
      "android": { "native": "omni", "universal": "https://links.omni.app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/2cd67b4c-282b-4809-e7c0-a88cd5116f00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "KEYRING PRO",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "keyring:", "universal": "https://keyring.app" },
      "android": { "native": "keyring:", "universal": "https://keyring.app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/dda0f0fb-34e8-4a57-dcea-b008e7d1ff00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "TokenPocket",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "tpoutside:" },
      "android": { "native": "tpoutside:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f3119826-4ef5-4d31-4789-d4ae5c18e400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BitPay",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitpay:", "universal": "https://link.bitpay.com/wallet" },
      "android": { "native": "bitpay:", "universal": "https://link.bitpay.com/wallet" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/97d4429f-eaf0-4302-87f5-9d26d46fe700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "MathWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "mathwallet:", "universal": "https://www.mathwallet.org" },
      "android": { "native": "mathwallet:", "universal": "https://www.mathwallet.org" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/26a8f588-3231-4411-60ce-5bb6b805a700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "WallETH",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/8b59dafd-9150-46be-9793-34e6d3298100?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a7f416de-aa03-4c5e-3280-ab49269aef00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "connectionLink": true,
    "blockchains": [...supported.evm]
  },
  {
    "name": "Authereum",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/deb6ec25-fcec-4b1b-c536-df3b4fb92b00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "1inch Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "1inch:", "universal": "https://wallet.1inch.io" },
      "android": { "native": "1inch:", "universal": "https://wallet.1inch.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/dce1ee99-403f-44a9-9f94-20de30616500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "iToken Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "huobiwallet:" },
      "android": { "native": "huobiwallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/5cd60c34-038d-470c-c024-d58f64260200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Eidoo",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "eidoo:", "universal": "https://eidoo.io/crypto-wallet" },
      "android": { "native": "eidoo:", "universal": "https://eidoo.io/crypto-wallet" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/ef5b8bcf-00d5-457d-e161-9911e4788700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "TrustVault",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/fc5e0354-cc1e-490d-fb62-477e83148000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Atomic",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/adb1ed3f-722c-48a0-441f-c75038a9a300?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CoolWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "coolwallet:" },
      "android": { "native": "coolwallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f581365d-e844-4d21-8e35-44a755a32d00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Unstoppable Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "moneyunstoppable:", "universal": "https://unstoppable.money" },
      "android": { "native": "moneyunstoppable:", "universal": "https://unstoppable.money" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/5c38b22c-adb9-4899-3252-6e3d71458500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Alice",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/bd1ce165-9b3a-4925-73c1-b329ca13e900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "AlphaWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "awallet:", "universal": "https://aw.app" },
      "android": { "native": "awallet:", "universal": "https://aw.app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/5b1cddfb-056e-4e78-029a-54de5d70c500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Pillar",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "pillarwallet:" },
      "android": { "native": "pillarwallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/0eb8230d-ce4c-42fb-2a57-a84a6eb7ea00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "D'CENT Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "dcent:", "universal": "https://link.dcentwallet.com" },
      "android": { "native": "dcent:", "universal": "https://link.dcentwallet.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/1efb49ec-2bab-4fa1-f2f2-4392c64ed000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ZelCore",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "zel:", "universal": "https://link.zel.network" },
      "android": { "native": "zel:", "universal": "https://link.zel.network" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/97d45a92-a1f0-46da-95a6-ad5db99f3500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Nash",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "nash:", "universal": "https://nash.io/walletconnect" },
      "android": { "native": "nash:", "universal": "https://nash.io/walletconnect" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/12f981b1-bb0a-4115-009f-317255979600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Coinomi",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://coinomi.page.link" },
      "android": { "universal": "https://coinomi.page.link" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3b446d16-a908-40c8-5835-9a6efe90dd00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "GridPlus",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3c928cbd-39dc-4090-c372-d4dcb3c89500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CYBAVO Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "cybavowallet:", "universal": "https://cdn.cybavo.com" },
      "android": { "native": "cybavowallet:", "universal": "https://cdn.cybavo.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3117d3ce-b973-4cfd-8fb5-f5d72ed3c200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Tokenary",
    "link": "WalletConnectV1",
    "desktop": { "native": "tokenary:", "universal": "https://tokenary.io" },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/5e481041-dc3c-4a81-373a-76bbde91b800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Torus",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/47d03b65-6be7-4004-5dba-7dadef6e6000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Spatium",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://caspiantechnologies.bitbucket.io" },
      "android": { "universal": "https://caspiantechnologies.bitbucket.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/e85caf96-8e6c-4ac5-5bb3-c13ac7edc700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SafePal",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://link.safepal.io" },
      "android": { "universal": "https://link.safepal.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/14096232-7483-425b-f9a9-658f94fe7100?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Infinito",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/b07624f3-fb36-45a4-200c-6cb2a930ef00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "wallet.io",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/82cdf116-4355-4e07-88e4-63dc2e253500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Infinity Wallet",
    "link": "WalletConnectV1",
    "desktop": { "native": "infinity:", "universal": "https://infinitywallet.io/" },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/9f259366-0bcd-4817-0af9-f78773e41900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ownbit",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/83b291fa-1a08-4871-3ddb-8faa8be6f200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bridge Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bridgewallet:", "universal": "https://bridge.mtpelerin.com" },
      "android": { "native": "bridgewallet:", "universal": "https://bridge.mtpelerin.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/989d504f-93db-4ca6-c00a-9d1faf177d00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SparkPoint",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "sparkpoint:", "universal": "https://sparkpoint.io" },
      "android": { "native": "sparkpoint:", "universal": "https://sparkpoint.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/34c4f901-70de-4507-e7a0-bc7887843000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ViaWallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/ffc3ba49-2e6b-4baa-304d-ebb253f74700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Vision",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/c279537a-920d-422c-6a65-8b3bd524c300?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "PEAKDEFI Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "peakdefiwallet:", "universal": "https://peakdefi.com/download" },
      "android": { "native": "peakdefiwallet:", "universal": "https://peakdefi.com/download" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/744a3fbe-4261-4148-133e-49c5b58cb400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Dok Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/6886f45d-1451-41ec-ebc7-b18bebfc3c00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "AT.Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a5b7369b-d92c-41a4-0263-ca28f4597600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Midas Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/4b7268e6-47fb-46bc-6f3c-424f44695f00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ellipal",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ellipal:", "universal": "https://www.ellipal.com/" },
      "android": { "native": "ellipal:", "universal": "https://www.ellipal.com/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/0a805e10-bfc0-4d02-d9c1-8cec88f0dc00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Aktionariat",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "aktionariat:", "universal": "https://app.aktionariat.com" },
      "android": { "native": "aktionariat:", "universal": "https://app.aktionariat.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/6d18e8ea-b536-4038-c5bf-94a499d5a400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Talken Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "talken-wallet:", "universal": "https://talken.io" },
      "android": { "native": "talken-wallet:", "universal": "https://talken.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/1afb5a3a-2da3-40ce-baf9-b416e7510600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "XinFin XDC Network",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/bee71890-cdbe-4a9a-0d51-6cc75078f600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "KyberSwap",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "kyberswap:", "universal": "https://kyberswapnew.app.link" },
      "android": { "native": "kyberswap:", "universal": "https://kyberswapnew.app.link" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3abd1720-260e-495a-2e31-3d0b349e0d00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Tongue Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "tongue:", "universal": "https://www.tongue.fi" },
      "android": { "native": "tongue:", "universal": "https://www.tongue.fi" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/20bc4fdb-b9e6-429a-8cba-c233b3273000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "RWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "rwallet:", "universal": "https://www.rwallet.app" },
      "android": { "native": "rwallet:", "universal": "https://www.rwallet.app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a883229c-26cb-4c19-9b34-1f0ed4012a00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "PlasmaPay",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "plasmapay:", "universal": "https://plasmapay.com/" },
      "android": { "native": "plasmapay:", "universal": "https://plasmapay.com/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/466c8fd0-fcec-4621-b94f-e91ce1439f00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "O3Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "o3wallet:", "universal": "https://o3.network" },
      "android": { "native": "o3wallet:", "universal": "https://o3.network" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/e1c7c6af-c731-463e-55f0-5e686e9f6200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "HashKey Me",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "hashme:", "universal": "https://me.hashkey.com" },
      "android": { "native": "hashme:", "universal": "https://me.hashkey.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/72734fac-9500-4c2c-81ba-678f7fc32700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Jade Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/8a6f6b6f-9e25-43d2-6cb8-42013579bd00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Guarda Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/0142b5f2-2006-465f-fe0e-2021225d8c00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Defiant",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "defiantapp:", "universal": "https://defiantapp.tech" },
      "android": { "native": "defiantapp:", "universal": "https://defiantapp.tech" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/026462e7-09a3-47f6-6b46-49df18133b00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Trustee Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/2432f3c2-83f1-486b-6081-d03acc33e000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CoinUs",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/1f92f9f9-08b9-4eca-4d75-425ce3d50100?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "cmorq",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/4e9f4558-32a2-46c9-be37-4926a6e95100?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Valora",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "celo://wallet", "universal": "https://valoraapp.com" },
      "android": { "native": "celo://wallet", "universal": "https://valoraapp.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a03bfa44-ce98-4883-9b2a-75e2b68f5700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "QuiverX",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/67acf8ad-da61-4b7f-609b-57224fb8b100?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Celo Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "celowallet:" },
      "android": { "native": "celowallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/482c9981-61c0-4782-84ec-c80fd997da00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Elastos Essentials",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "essentials:", "universal": "https://essentials.elastos.net" },
      "android": { "native": "essentials:", "universal": "https://essentials.elastos.net" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/04a6bfed-d80e-4f7b-0516-261f86aa4000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "fuse.cash",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "fuse.cash:", "universal": "https://app.fuse.cash/" },
      "android": { "native": "fuse.cash:", "universal": "https://app.fuse.cash/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/71828267-72d6-4680-e144-265e6dc1e400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Stasis",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "stasis:", "universal": "https://app.stasis.net" },
      "android": { "native": "stasis:", "universal": "https://app.stasis.net" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/7ae753bc-a754-450c-2d90-2c5521734400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "JulWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "julwallet:", "universal": "https://justliquidity.org" },
      "android": { "native": "julwallet:", "universal": "https://justliquidity.org" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/cabd50de-22fa-487b-ce68-2c63de8bb800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "f(x) Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/4d5c5c70-5abb-43ba-fc5e-577b6e403300?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bull App",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/b3c42bfd-5078-4616-a2ad-e4e322bbf600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Anybit",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/6aac5fb1-d400-4e81-4709-bef8b2c00900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bitpie",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitpie:" },
      "android": { "native": "bitpie:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f9b7c668-ed26-47f7-d8c9-7eadc7114800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Minerva Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/7d5f3710-7c2c-49fc-7893-bacd3f384000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ArchiPage",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "archipage:" },
      "android": { "native": "archipage:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/b62c4f22-e781-4ca9-5c01-ef7cd9d23400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Tangem",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "tangem:", "universal": "https://app.tangem.com" },
      "android": { "native": "tangem:", "universal": "https://app.tangem.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/8a5b6e94-e378-458d-bf2e-017cc7958e00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Chainge Finance",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/addaaf64-cf13-46ef-a022-d97189156f00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ioPay",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "iopay:" },
      "android": { "native": "iopay:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/aa40d575-f7f4-4aa6-12c4-c8f055ad0800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Coinhub",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/cd7d6974-739b-46d7-bd10-604222e16e00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Go Pocket",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/2494a686-3e07-4e9b-15ef-3605dca32a00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Wallet 3",
    "link": "WalletConnectV1",
    "desktop": { "native": "wallet3:" },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/d740b48c-2b55-4a27-b5f5-d2188200ca00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "yiToken",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "yitoken:" },
      "android": { "native": "yitoken:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/b5cc13d4-2a58-4142-08dd-5596ab253800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "DID Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "abt:" },
      "android": { "native": "abt:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/673b7f3b-a555-4327-f9b7-fefa535bc500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "StarBase",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/2bd78dfd-37d9-4334-8afb-17544b85f200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Shinobi Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f5cf868c-5347-4d5e-e80f-c6ece8fcb600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "AirGap Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "airgap-wallet://" },
      "android": { "native": "airgap-wallet://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/76bfe8cd-cf3f-4341-c33c-60da01065000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "PayTube",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/58230f60-6c7b-400c-ab96-cb1fd0391700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SecuX",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "secux://", "universal": "https://wsweb.secuxtech.com" },
      "android": { "native": "secux://", "universal": "https://wsweb.secuxtech.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/w3m/v1/getWalletImage/6013a9a1-4a67-45bb-fc24-27c11eb13900?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BlockBank",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/5b2cc39f-bc4f-4ac1-b6d7-08bcc9066a00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Orange",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "orangewallet:", "universal": "https://link.orangewallet.app" },
      "android": { "native": "orangewallet:", "universal": "https://link.orangewallet.app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/7fcbf9f0-0c0b-439d-3fdb-31b32c28df00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "NEFTiPEDiA",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3f503c40-d5f0-4430-b996-3126a9968c00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Krystal",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "krystalWallet:" },
      "android": { "native": "krystalWallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/91449cb2-57b0-4bb6-481b-47d489f7a800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ambire Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ambire:", "universal": "https://mobile.ambire.com" },
      "android": { "native": "ambire:", "universal": "https://mobile.ambire.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/c39b3a16-1a38-4588-f089-cb7aeb584700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "PayBolt",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "paybolt://Wallet" },
      "android": { "native": "paybolt://Wallet" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/cc8f4e0c-56a8-465a-6cb6-3e9d60846500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "OKX Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "okex://main" },
      "android": { "native": "okex://main" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/45f2f08e-fc0c-4d62-3e63-404e72170500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Backpack",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ndj-backpack:", "universal": "https://jxndao.com" },
      "android": { "native": "ndj-backpack:", "universal": "https://jxndao.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/e46f132d-6e05-4d51-8720-43727446e600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Mask Network",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/51fa27fd-8a21-4de0-c084-528e4a37ad00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Uniblow",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3aa86daa-b885-4686-c443-83355e1b3b00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Autonomy: Digital Art Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "autonomy-wc", "universal": "https://autonomy.io/apps/wc" },
      "android": { "native": "autonomy-wc", "universal": "https://autonomy.io/apps/wc" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/2ee7c9db-9a86-4cd6-0d32-5053b4636100?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Lilico",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "lilico://", "universal": "https://link.lilico.app/wc" },
      "android": { "native": "lilico://", "universal": "https://link.lilico.app/wc" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/70c0bc88-7bb1-4c1f-3531-9a5f799fb100?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/7e1514ba-932d-415d-1bdb-bccb6c2cbc00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "WATT ME",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "wattwallet://wallet-connect/" },
      "android": { "native": "wattwallet://wallet-connect/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/38c619c4-5365-4de5-09b2-cdde8caf3600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Coingrig",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "coingrig://", "universal": "https://link.coingrig.com" },
      "android": { "native": "coingrig://", "universal": "https://link.coingrig.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/18e38e41-a387-4402-ca31-6d2d5eb91100?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Cryptnox Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/2947b7c8-8966-4485-a98d-25fe43c16700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/aff8973b-e093-45b5-4858-c01dd043bc00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Plasma Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "plasmawallet:", "universal": "https://plasma-wallet.com" },
      "android": { "native": "plasmawallet:", "universal": "https://plasma-wallet.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/c268e78d-ffb0-4c8b-5cad-04c3add48500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Holdstation Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/27553327-b647-4bfb-8524-b7558e804400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "FirstWallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/864565a8-66ab-4b50-fda6-1c29128f6b00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "HUMBL WALLET",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "humblwallet:", "universal": "https://wallet.search3.com" },
      "android": { "native": "humblwallet:", "universal": "https://wallet.search3.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/1ac55ba2-aa98-4ed0-59b3-b3155dea4200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Zelus",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "zeluswallet://" },
      "android": { "native": "zeluswallet://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/aeba2105-6c84-4642-f441-b3f5817ac400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Earth Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "earthwallet:" },
      "android": { "native": "earthwallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/d3f724c4-f99b-476f-10f8-12aa4af13800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Boba Multisig",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/5acb31bf-151e-4ae6-02bd-f109ca47b600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "EASY",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "co.theeasy.app://", "universal": "https://link.easy.me" },
      "android": { "native": "co.theeasy.app://", "universal": "https://link.easy.me" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/62feb41a-be1f-4b1c-e089-27f97c0e8d00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ISLAMIwallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "poc://islamiwallet.com", "universal": "https://islamiwallet.com" },
      "android": { "native": "poc://islamiwallet.com", "universal": "https://islamiwallet.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/8d723c78-28ad-4610-901f-ea391d7e8d00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Card Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "cardwallet://", "universal": "https://wallet.cardstack.com" },
      "android": { "native": "cardwallet://", "universal": "https://wallet.cardstack.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/325428cf-c212-4d83-a434-7f48902d2c00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "GameStop Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/c12536e0-dff1-4a1a-6c8f-c7247d6aa200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "RealT Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/bf1f251b-08a5-4b27-ae4a-201a5f698900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "PLTwallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "pltwallet:", "universal": "https://pltwallet.io/" },
      "android": { "native": "pltwallet:", "universal": "https://pltwallet.io/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a5d9dd15-8cef-42de-8bed-09e01a8b0200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Avacus",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "avacus://", "universal": "https://avacus.app.link" },
      "android": { "native": "avacus://", "universal": "https://avacus.app.link" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a7106965-91cc-4a73-4688-c5c72ae0ed00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "StrikeX Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "strikex://" },
      "android": { "native": "strikex://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/cae46de2-b432-4002-8bc8-1f0e7380b200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BCERTin wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/e321346d-5ce7-4e75-371e-e4f0bf923900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bycoin",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/980b0c5f-353d-4643-1ee8-d9264ec30000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Edge Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "edge://", "universal": "https://deep.edge.app/wc" },
      "android": { "native": "edge://", "universal": "https://deep.edge.app/wc" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f601bc29-4298-422f-dbf7-34dac2884f00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Freedom Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "freedom-wallet://" },
      "android": { "native": "freedom-wallet://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/42a6f275-96c8-4cd0-9b7a-acc5f054a800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Assure",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "assure://", "universal": "https://www.assure.pro/Official" },
      "android": { "native": "assure://", "universal": "https://www.assure.pro/Official" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/64db7104-c8b7-44ea-e102-11ce87124200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Cosmostation",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "cosmostation://" },
      "android": { "native": "cosmostation://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/ea26c3c8-adb6-4dc4-ee02-35d6eee02800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "THORWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "thorwallet:" },
      "android": { "native": "thorwallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/19a02756-462c-4e8a-2d32-af0f9bcf3d00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "DeFi Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/017d9dc4-dd04-4934-5be8-1d564e924a00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Gryfyn",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/51bb1507-45a1-4d21-15f2-1cc2ebe69400?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CoinStats",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "coinstats:", "universal": "https://coinstats.app" },
      "android": { "native": "coinstats:", "universal": "https://coinstats.app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f989ab84-650b-4ad5-c342-77f3334f1b00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Abra Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "abra:" },
      "android": { "native": "abra:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/2219db01-e0c9-471c-5def-fd3b4e7a7a00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Opera Crypto Browser",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "cryptobrowser://" },
      "android": { "native": "cryptobrowser://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/877fa1a4-304d-4d45-ca8e-f76d1a556f00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Pera Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "algorand://" },
      "android": { "native": "algorand://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/d4a1258e-d154-4885-0489-856c33e91e00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Keywallet Touch",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "keywalletTouch://" },
      "android": { "native": "keywalletTouch://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/ceefb75b-2632-40c6-7471-ea23d3d49800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Enno Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ennowallet:" },
      "android": { "native": "ennowallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/ae4f5167-0b61-43bd-7d76-1f8579271000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SoCap Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/99c0152b-1001-4f24-3293-a9125374f900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Talk+",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "talkapp:" },
      "android": { "native": "talkapp:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/d24cdd56-6f55-42da-631b-c25974c36f00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "A4 Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/7a788c03-daf7-4d93-fa3a-f94e2b719900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bitcoin.com Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitcoincom://", "universal": "https://wallet.bitcoin.com/" },
      "android": { "native": "bitcoincom://", "universal": "https://wallet.bitcoin.com/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/0d7938e1-9b3b-4d8b-177b-98188c4cf400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Defiant",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "defiantapp://", "universal": "https://defiantapp.tech/" },
      "android": { "native": "defiantapp://", "universal": "https://defiantapp.tech/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/11a96ca4-3592-42ae-c781-2b7265ec9200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Chain",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f9f3d8da-e791-47d2-98c2-031712617e00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/109d7c90-86ed-4ee0-e17d-3c87624ddf00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "LOBSTR Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "lobstr://", "universal": "https://lobstr.co/uni/wc" },
      "android": { "native": "lobstr://", "universal": "https://lobstr.co/uni/wc" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/0dafcaab-0852-47f7-85dd-436b86491d00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bifrost Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bifrostwallet:", "universal": "https://app.bifrostwallet.com" },
      "android": { "native": "bifrostwallet:", "universal": "https://app.bifrostwallet.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/86be07e2-6652-4fd1-5f33-651682c95400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Okse Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "oksewallet:" },
      "android": { "native": "oksewallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/8a1b36d5-7f40-403a-7000-5d30f9181200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BRISE Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/09a4e1d9-e4de-44fa-f248-5495ba9ab300?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "LZ Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/e3272444-3876-49d3-2f84-004b818d3800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/2e85f1d1-f498-4cae-bb54-1d40614ee300?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Frontier",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "frontier://" },
      "android": { "native": "frontier://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a78c4d48-32c1-4a9d-52f2-ec7ee08ce200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "MDAO Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ttmwalletapp://" },
      "android": { "native": "ttmwalletapp://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/82014e92-838b-4e75-e77e-76cdc5539d00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "TTM Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ttmwalletapp:" },
      "android": { "native": "ttmwalletapp:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/82014e92-838b-4e75-e77e-76cdc5539d00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Dentacoin Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "dentacoin-wallet://" },
      "android": { "native": "dentacoin-wallet://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/34910dc0-9f3b-4407-115d-673707602900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Opto Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "opto://" },
      "android": { "native": "opto://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3df102e4-e435-49dd-d4b1-5ea74ebed500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "XFUN Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "xfunwallet://", "universal": "https://xfun.io" },
      "android": { "native": "xfunwallet://", "universal": "https://xfun.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a665f8f3-09ef-4d17-2bd0-26dca4518400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/4c16cad4-cac9-4643-6726-c696efaf5200?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Uvtoken",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "UvToken://" },
      "android": { "native": "UvToken://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/52b9a9fc-caff-469e-033b-6d6f14e41800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "S-ONE Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "sone://", "universal": "https://sonewallet.app" },
      "android": { "native": "sone://", "universal": "https://sonewallet.app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/b3562637-a407-4035-6fa5-a70ff2050400?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/6487869b-1165-4f30-aa3a-115665be8300?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Shinobi-Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "shinobi-wallet://" },
      "android": { "native": "shinobi-wallet://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/685c986c-3e80-4701-cec6-cd247ba1a700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ByteBank",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "hideoutWallet:" },
      "android": { "native": "hideoutWallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/bc7aacd6-b2e2-4146-7d21-06e0c5d44f00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ancrypto Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ancrypto://app" },
      "android": { "native": "ancrypto://app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/d4382329-e288-4d7a-0ac8-3eb0facfb900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bee Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "beewallet.app://", "universal": "https://beewallet.app/wc" },
      "android": { "native": "beewallet.app://", "universal": "https://beewallet.app/wc" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f90bc33f-f085-40cf-7538-fae5ae84f900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "LATOKEN Multichain DeFi Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "dfwallet:" },
      "android": { "native": "dfwallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/ff858a37-cbcb-413d-c1ed-917a444bea00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "TK Finance",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "tk://", "universal": "https://trustkeys.network" },
      "android": { "native": "tk://", "universal": "https://trustkeys.network" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/c4066f68-2247-49bf-ac8a-a677bfa81800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Oxalus Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "oxalus://", "universal": "https://deeplink.oxalus.io" },
      "android": { "native": "oxalus://", "universal": "https://deeplink.oxalus.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a6e22fcb-6b69-45d2-b52d-a4a347a21e00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "3S Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bhcwallet://" },
      "android": { "native": "bhcwallet://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f3b6a89d-ec8f-49dc-e07f-6bf723e1e500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Klever Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "kleverwallet:", "universal": "https://klever.page.link" },
      "android": { "native": "kleverwallet:", "universal": "https://klever.page.link" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/8f5bbad8-6a14-4b2c-5343-cc1fca6e4d00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/12bebb3f-8030-4892-8452-c60a6bac1500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "helix id",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "helix-id://helix-id.com" },
      "android": { "native": "helix-id://helix-id.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/4083ef71-8389-4682-ded6-0099236d2e00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CeloDance",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "celo://wallet/dappkit/celodance" },
      "android": { "native": "celo://wallet/dappkit/celodance" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/47c8ab7b-a66c-4949-f0fe-b0c2c169ee00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Volt: DeFi",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "volt:", "universal": "https://get.voltage.finance" },
      "android": { "native": "volt:", "universal": "https://get.voltage.finance" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/51d783cb-0686-4ffa-e661-edca0c380000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Wirex Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "wirexwallet://", "universal": "https://wwallet.app.link" },
      "android": { "native": "wirexwallet://", "universal": "https://wwallet.app.link" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/769739aa-ff45-4db5-c6e6-70590741ec00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Robinhood Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "robinhood-wallet:" },
      "android": { "native": "robinhood-wallet:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/dfe0e3e3-5746-4e2b-12ad-704608531500?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "RiceWallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "ricewallet", "universal": "https://ricewallet.io" },
      "android": { "native": "ricewallet", "universal": "https://ricewallet.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/df94578e-19be-4f00-258f-2470343e7b00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SafeMoon",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "safemoon:", "universal": "https://safemoon.net/" },
      "android": { "native": "safemoon:", "universal": "https://safemoon.net/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/ecc31a8e-0ee9-49db-cc59-0876b7c35600?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SimpleHold",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "simplehold://", "universal": "https://simplehold.io" },
      "android": { "native": "simplehold://", "universal": "https://simplehold.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a9f1ba96-b658-4d13-f71f-226b6389f000?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "GoldBit",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "goldbit://" },
      "android": { "native": "goldbit://" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/11974ef1-21ab-4806-a2b1-362c31499900?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ioPay",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "iopay:" },
      "android": { "native": "iopay:" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/18891f5a-fd0f-4126-7d1a-452be6714700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bitizen",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "bitizen://wallet", "universal": "https://bitizen.org/wallet" },
      "android": { "native": "bitizen://wallet", "universal": "https://bitizen.org/wallet" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/75dd1471-77e9-4811-ce57-ec8fc980ec00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Slavi Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "slaviwallet:", "universal": "https://www.slaviwallet.io" },
      "android": { "native": "slaviwallet:", "universal": "https://www.slaviwallet.io" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/282ce060-0beb-4236-b7b0-1b34cc6c8f00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
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
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/70080bd7-9858-4720-cf74-8f74cd74cb00?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Arianee Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "com.arianee.wallet", "universal": "https://arianee.net" },
      "android": { "native": "com.arianee.wallet", "universal": "https://arianee.net" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/ace938a9-c906-4b9e-f683-b85f1ab72800?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "NOW Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "walletnow://", "universal": "https://walletnow.app.link" },
      "android": { "native": "walletnow://", "universal": "https://walletnow.app.link" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/b6ee4efc-f53e-475b-927b-a7ded6211700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Arculus Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "native": "arculuswc:", "universal": "https://gw.arculus.co/app" },
      "android": { "native": "arculuswc:", "universal": "https://gw.arculus.co/app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f78dab27-7165-4a3d-fdb1-fcff06c0a700?projectId=ec576959c7769a8b4dbbb3da3f12fef4",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Binana",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://master.tokenone.app" },
      "android": { "universal": "https://master.tokenone.app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/65a60845-8fe3-4146-2688-586e4dc68a00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Fundamenta Mobile",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://app.civiport.online" },
      "android": { "universal": "https://app.civiport.online" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/79797f9e-a6c7-4284-1a1c-88332f11ea00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Nitrogen Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://nitrogen.org/wc" },
      "android": { "universal": "https://nitrogen.org/wc" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/af185895-cda5-4eaf-e31b-28b6fe4b0800?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ApolloX",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://app.apollox.finance" },
      "android": { "universal": "https://app.apollox.finance" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/80ab63a2-1b32-4140-3577-9fbc8ea82e00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ID Pocket",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/c227ee0a-5127-4707-ded9-c3cd81348d00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CoinCircle",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://coincircle.com/app/walletconnect" },
      "android": { "universal": "https://coincircle.com/app/walletconnect" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/eae63a23-c7ba-4f7e-24b3-e6fc69215d00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Dracula Metaverse",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/7259499f-3a9c-4905-d881-19944500d000?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "SahalWallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/d29d6426-b6f2-481b-12d8-7b20ec82af00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "UPBOND Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/698e08f3-b452-4c91-9f65-299939396a00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Sequence Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://sequence.app" },
      "android": { "universal": "https://sequence.app" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/b2d5c39c-a485-4efa-5736-a782204e4a00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "LocalTrade Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://ws.lab.localtrade.cc" },
      "android": { "universal": "https://ws.lab.localtrade.cc" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/fcc60983-74ae-484a-4242-87cb6f05f100?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Loopring Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/2103feda-4fc8-4635-76a7-02a4ed998000?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Vision: Crypto Wallet",
    "link": "WalletConnectV1",
    "mobile": { 
      "ios": { "universal": "https://app.vision-crypto.com" },
      "android": { "universal": "https://app.vision-crypto.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/64ccf07c-1fba-4473-49e8-dc446e5a5000?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Ballet Crypto",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/542094e6-70d6-4b0d-4c8f-b61cc2c38500?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Pitaka",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "native": "pitaka://", "universal": "https://app.pitaka.io" },
      "android": { "native": "pitaka://", "universal": "https://app.pitaka.io" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/691c0716-5213-4b99-e837-079268313800?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "AbsoluteWallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/03797059-fc49-4adc-7b93-503290b62300?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "The Parallel",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/de73fe0b-0244-4373-dea4-bef78ca82e00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "CypherD Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/6dfec0f3-2cbb-4300-b049-d66d28fcf400?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Keplr",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/527324b0-3849-462b-9a1a-72b53bdfea00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "MyWalliD",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/e6cff623-9671-4a39-acc7-1c2292d7e100?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Status",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/e131fa98-8c4f-4680-f5b6-6fb77189c900?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Monarch Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://monarchwallet.com" },
      "android": { "universal": "https://monarchwallet.com" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/c664d955-8a1e-4460-3917-4cfcf198f000?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Marble",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://app.marblewallet.com/" },
      "android": { "universal": "https://app.marblewallet.com/" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/eb6de921-6824-4f35-6331-8a8b031e7100?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Flooz",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://wallet.flooz.trade/wc" },
      "android": { "universal": "https://wallet.flooz.trade/wc" },
    },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/0a04f368-4f56-4c12-0bfa-93b14bb20800?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Blockchain.com",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://login.blockchain.com/deeplink/login/wallet-connect" },
      "android": { "universal": "https://login.blockchain.com/deeplink/login/wallet-connect" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/fc282669-2dbe-44d5-33fc-9168fcf08600?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Dohrnii Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/1bb51ed9-68ed-4012-3082-72dcb7754300?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "UniPass",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://wallet.unipass.id" },
      "android": { "universal": "https://wallet.unipass.id" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/77865965-4322-4ac4-5049-b2af11bf8300?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ZenGo",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://get.zengo.com" },
      "android": { "universal": "https://get.zengo.com" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/d1794d97-ea1f-4966-be42-9f614bb5d800?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Locker Token",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/37401d35-3fa1-451c-802d-604940315800?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Keeper",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://link.keeper-wallet.app" },
      "android": { "universal": "https://link.keeper-wallet.app" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/41f6ac85-8f4e-4d9f-b37b-92b43fa7f400?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "XDEFI Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/efec6318-7f96-4b30-9287-6c287660cd00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BeeWallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/ae53ba0b-4d01-42f6-53d8-cc568409b700?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Numio",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/416ee463-6699-43f7-c0e3-396f0ad3d300?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "UvToken",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "native": "UvToken://" },
      "android": { "native": "UvToken://" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/a0057241-cd91-4a53-7175-016b76bfd900?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Neon Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/322bd6f0-09b5-4595-cb15-0dfab8054800?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Nabox",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://nabox.io/app/" },
      "android": { "universal": "https://nabox.io/app/" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3b75e9f7-2ca8-4a33-ed2b-4e8a0c048d00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Snowball",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://app.snowball.exchange/app" },
      "android": { "universal": "https://app.snowball.exchange/app" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/313faea4-af8c-41f4-0ed8-98be5d048e00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "KryptoGO Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://kryptogo.page.link" },
      "android": { "universal": "https://kryptogo.page.link" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/3ccbd966-97e8-45a0-1ceb-6141a8978e00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Payperless",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/4a867e30-44c9-4627-6281-33457b8e2100?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Brave Wallet",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/8cecad66-73e3-46ee-f45f-01503c032f00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Crossmint",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/8ad627ec-cbcd-4878-ec5c-3df588055200?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Safematrix",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://safematrix.io/" },
      "android": { "universal": "https://safematrix.io/" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/48ea5de9-869a-4994-2402-97afba060900?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "pier",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://pierwallet.com/wc" },
      "android": { "universal": "https://pierwallet.com/wc" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/cf3f0da1-40ec-4940-aebe-df075513d100?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "FILWallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://h5.filwallet.co" },
      "android": { "universal": "https://h5.filwallet.co" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f400f6c2-ca6c-487b-654d-e119af247500?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "ParaSwap Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://wallet.paraswap.io/#/" },
      "android": { "universal": "https://wallet.paraswap.io/#/" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/73dc6b30-b644-46e6-020c-5926851df600?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Bitski",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://wallet.bitski.com/walletconnect" },
      "android": { "universal": "https://wallet.bitski.com/walletconnect" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/94d94cb5-a94f-47cf-70e6-fe8d3f1c3700?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Hippo Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "native": "hippowallet://", "universal": "https://hippowallet.io" },
      "android": { "native": "hippowallet://", "universal": "https://hippowallet.io" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/f9570968-45f7-47c1-3189-98cf60e25c00?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Core",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://core.app" },
      "android": { "universal": "https://core.app" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/35f9c46e-cc57-4aa7-315d-e6ccb2a1d600?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Xcapit",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://app.xcapit.com/links" },
      "android": { "universal": "https://app.xcapit.com/links" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/17f59b75-21b0-4b3f-b024-fe4b9b8d2300?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "Paper Wallet",
    "link": "WalletConnectV1",
    "mobile": {
      "ios": { "universal": "https://paper.xyz" },
      "android": { "universal": "https://paper.xyz" },
     },
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/37d7a10f-d94d-4a56-c30e-267e8afbd500?projectId=a8d876c6f91c3748db621583fad358f1",
    "blockchains": [...supported.evm]
  },
  {
    "name": "BC Vault",
    "link": "WalletConnectV1",
    "logo": "https://explorer-api.walletconnect.com/v3/logo/lg/4d7bf99f-b2d9-48b0-5d7e-7d64f9a4f700?projectId=a8d876c6f91c3748db621583fad358f1",
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
