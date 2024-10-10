/*#if _EVM

let supported = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'fantom', 'worldchain']
supported.evm = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'fantom', 'worldchain']
supported.svm = []
supported.solana = []

/*#elif _SOLANA

let supported = ['solana']
supported.evm = []
supported.svm = ['solana']
supported.solana = ['solana']

//#else */

let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'fantom', 'worldchain']
supported.evm = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'fantom', 'worldchain']
supported.svm = ['solana']
supported.solana = ['solana']

//#endif

export { supported }
