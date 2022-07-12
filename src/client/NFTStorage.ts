import { NFTStorage } from 'nft.storage'
import { NFT_STORAGE_KEY } from '../constants'

export { NFTStorage, Blob, File } from 'nft.storage'
export default new NFTStorage({ token: NFT_STORAGE_KEY })