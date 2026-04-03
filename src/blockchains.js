/*#if _EVM

let supported = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain', 'celo']
supported.evm = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain', 'celo']
supported.svm = []

/*#elif _SVM

let supported = ['solana']
supported.evm = []
supported.svm = ['solana']

//#else */

let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain', 'celo']
supported.evm = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain', 'celo']
supported.svm = ['solana']

//#endif

export { supported }
