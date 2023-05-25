/*#if _EVM

let supported = ['ethereum', 'bsc', 'polygon']
supported.evm = ['ethereum', 'bsc', 'polygon']
supported.solana = []

/*#elif _SOLANA

let supported = ['solana']
supported.evm = []
supported.solana = ['solana']

//#else */

let supported = ['ethereum', 'bsc', 'polygon', 'solana']
supported.evm = ['ethereum', 'bsc', 'polygon']
supported.solana = ['solana']

//#endif

export { supported }
