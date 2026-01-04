import { videoClient } from '../shared'
import { AuthHttpRepository } from './auth.http-repository'

export const authRepository = new AuthHttpRepository(videoClient)

export * from './account.mapper'
export * from './auth.mapper'
export * from './session.mapper'
