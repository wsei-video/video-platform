import { videoClient } from '../shared'
import HttpReactionRepository from './reaction.http-repository'

export const reactionRepository = new HttpReactionRepository(videoClient)