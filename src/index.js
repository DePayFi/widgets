import Connect from './Connect'
import Donation from './Donation'
import Payment from './Payment'
import Sale from './Sale'
import { provider } from '@depay/web3-client'

let DePayWidgets = {
  Connect,
  Payment,
  Sale,
  Donation,
  provider
}

export default DePayWidgets
