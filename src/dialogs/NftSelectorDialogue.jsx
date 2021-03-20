import CloseDialogComponent from '../components/CloseDialogComponent'
import Fuse from 'fuse.js'
import GoBackDialogComponent from '../components/GoBackDialogComponent'
import ImportToken from '../utils/ImportToken'
import PropTypes from 'prop-types'
import React from 'react'
import TokenIconComponent from '../components/TokenIconComponent'
import TokenList from '../utils/TokenList'
import { ethers } from 'ethers'

class NftSelectorDialogue extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    const { sender } = this.props
    const fetchAssetsResponse = await fetch(
      `https://api.opensea.io/api/v1/assets?owner=${sender}&order_direction=desc&offset=0&limit=20`,
    )

    const assets = await fetchAssetsResponse.json()
    console.log('assets', assets)
  }

  render() {
    return <div>NFT Selector 2021</div>
  }
}

export default NftSelectorDialogue
