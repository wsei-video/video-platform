import { videoClient } from '../shared'
import HttpVideoRepository from './video.http-repository'

export const videoRepository = new HttpVideoRepository(videoClient)
