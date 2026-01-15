import { videoClient } from '../shared'
import HttpCommentRepository from './comment.http-repository'

export const commentRepository = new HttpCommentRepository(videoClient)