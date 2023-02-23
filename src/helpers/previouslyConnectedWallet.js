const KEY = '_DePayConnectDialogPreviouslyConnectedWallet'

const set = (value)=>{ localStorage[KEY] = value }

const get = ()=>localStorage[KEY]

export { set, get }
