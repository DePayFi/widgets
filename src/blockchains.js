/*#if _EVM

let supported = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain']
supported.evm = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain']
supported.svm = []

/*#elif _SVM

let supported = ['solana']
supported.evm = []
supported.svm = ['solana']

//#else */

let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain']
supported.evm = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain']
supported.svm = ['solana']

//#endif

export { supported }
