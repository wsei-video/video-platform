import axios, { type AxiosInstance } from 'axios'

import type {
  CommentReaction,
  CreateCommentReactionCommand,
  CreateVideoReactionCommand,
  DeleteCommentReactionCommand,
  DeleteVideoReactionCommand,
  ReactionRepository,
  VideoReaction,
} from '@/domain/reaction'
import type { PaginatedList, PaginationOptions } from '@/domain/shared/types'

import type {
  VideoCommentReactionDto,
  VideoCommentReactionsDto,
  VideoReactionDto,
  VideoReactionsDto,
} from '../shared'
import type {
  VideoCommentReactionCreateDto,
  VideoReactionCreateDto,
} from '../shared/video-api.dtos'
import { ReactionMapper } from './reaction.mapper'

export default class HttpReactionRepository implements ReactionRepository {
  constructor(private readonly httpClient: AxiosInstance) {}

  async createVideoReaction(command: CreateVideoReactionCommand): Promise<VideoReaction> {
    const res = await this.httpClient.put<VideoReactionDto>(
      `/v1/videos/${command.videoId}/reaction`,
      { content: command.content } as VideoReactionCreateDto,
    )
    return ReactionMapper.toVideoReactionModel(res.data)
  }

  async deleteVideoReaction(command: DeleteVideoReactionCommand): Promise<void> {
    await this.httpClient.delete(`/v1/videos/${command.videoId}/reaction`)
  }

  async fetchVideoReactions(
    videoId: string,
    pageOptions: PaginationOptions,
  ): Promise<PaginatedList<VideoReaction>> {
    const res = await this.httpClient.get<VideoReactionsDto>(`/v1/videos/${videoId}/reactions`, {
      params: pageOptions,
    })
    return ReactionMapper.toPaginatedVideoReactionModel(res.data)
  }

  async getVideoReaction(videoId: string, reactionId: string): Promise<VideoReaction> {
    const res = await this.httpClient.get<VideoReactionDto>(
      `/v1/videos/${videoId}/reactions/${reactionId}`,
    )
    return ReactionMapper.toVideoReactionModel(res.data)
  }

  async deleteVideoReactionById(videoId: string, reactionId: string): Promise<void> {
    await this.httpClient.delete(`/v1/videos/${videoId}/reactions/${reactionId}`)
  }

  async getUserVideoReaction(videoId: string): Promise<VideoReaction | null> {
    try {
      const res = await this.httpClient.get<VideoReactionDto>(`/v1/videos/${videoId}/reaction`)
      return ReactionMapper.toVideoReactionModel(res.data)
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        return null
      }
      throw e
    }
  }

  async createCommentReaction(command: CreateCommentReactionCommand): Promise<CommentReaction> {
    const res = await this.httpClient.put<VideoCommentReactionDto>(
      `/v1/videos/${command.videoId}/comments/${command.commentId}/reaction`,
      { content: command.content } as VideoCommentReactionCreateDto,
    )
    return ReactionMapper.toCommentReactionModel(res.data)
  }

  async deleteCommentReaction(command: DeleteCommentReactionCommand): Promise<void> {
    await this.httpClient.delete(
      `/v1/videos/${command.videoId}/comments/${command.commentId}/reaction`,
    )
  }

  async fetchCommentReactions(
    videoId: string,
    commentId: string,
    pageOptions: PaginationOptions,
  ): Promise<PaginatedList<CommentReaction>> {
    const res = await this.httpClient.get<VideoCommentReactionsDto>(
      `/v1/videos/${videoId}/comments/${commentId}/reactions`,
      { params: pageOptions },
    )
    return ReactionMapper.toPaginatedCommentReactionModel(res.data)
  }

  async getCommentReaction(
    videoId: string,
    commentId: string,
    reactionId: string,
  ): Promise<CommentReaction> {
    const res = await this.httpClient.get<VideoCommentReactionDto>(
      `/v1/videos/${videoId}/comments/${commentId}/reactions/${reactionId}`,
    )
    return ReactionMapper.toCommentReactionModel(res.data)
  }

  async deleteCommentReactionById(
    videoId: string,
    commentId: string,
    reactionId: string,
  ): Promise<void> {
    await this.httpClient.delete(
      `/v1/videos/${videoId}/comments/${commentId}/reactions/${reactionId}`,
    )
  }

  async getUserCommentReaction(
    videoId: string,
    commentId: string,
  ): Promise<CommentReaction | null> {
    try {
      const res = await this.httpClient.get<VideoCommentReactionDto>(
        `/v1/videos/${videoId}/comments/${commentId}/reaction`,
      )
      return ReactionMapper.toCommentReactionModel(res.data)
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        return null
      }
      throw e
    }
  }
}
