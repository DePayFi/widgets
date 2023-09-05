/*#if _EVM

let supported = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'fantom']
supported.evm = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'fantom']
supported.solana = []

/*#elif _SOLANA

let supported = ['solana']
supported.evm = []
supported.solana = ['solana']

//#else */

let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'fantom']
supported.evm = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'fantom']
supported.solana = ['solana']

//#endif

export { supported }
