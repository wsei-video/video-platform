import type { AxiosInstance } from 'axios'

import type {
  Comment,
  CommentCreateCommand,
  CommentReply,
  CommentReplyCreateCommand,
  CommentReplyUpdateCommand,
  CommentRepository,
  CommentUpdateCommand,
} from '@/domain/comment'
import type { PaginatedList, PaginationOptions } from '@/domain/shared/types'

import type {
  VideoCommentDto,
  VideoCommentRepliesDto,
  VideoCommentReplyDto,
  VideoCommentsDto,
} from '../shared'
import { CommentMapper } from './comment.mapper'
import { CommentReplyMapper } from './comment-reply.mapper'

export default class HttpCommentRepository implements CommentRepository {
  constructor(private readonly httpClient: AxiosInstance) {}

  private getBaseUrl(videoId: string) {
    return `/v1/videos/${videoId}/comments`
  }

  async fetchComments(
    videoId: string,
    pageOptions: PaginationOptions,
  ): Promise<PaginatedList<Comment>> {
    const res = await this.httpClient.get<VideoCommentsDto>(`${this.getBaseUrl(videoId)}`, {
      params: pageOptions,
    })
    return CommentMapper.toPaginatedModel(res.data)
  }

  async getComment(videoId: string, commentId: string): Promise<Comment> {
    const res = await this.httpClient.get<VideoCommentDto>(
      `${this.getBaseUrl(videoId)}/${commentId}`,
    )
    return CommentMapper.toModel(res.data)
  }

  async createComment(command: CommentCreateCommand): Promise<Comment> {
    const dto = CommentMapper.toCreateDto(command)
    const res = await this.httpClient.post<VideoCommentDto>(
      `${this.getBaseUrl(command.videoId)}`,
      dto,
    )
    return CommentMapper.toModel(res.data)
  }

  async updateComment(command: CommentUpdateCommand): Promise<Comment> {
    const dto = CommentMapper.toUpdateDto(command)
    const res = await this.httpClient.patch<VideoCommentDto>(
      `${this.getBaseUrl(command.videoId)}/${command.commentId}`,
      dto,
    )
    return CommentMapper.toModel(res.data)
  }

  async deleteComment(videoId: string, commentId: string): Promise<void> {
    await this.httpClient.delete(`${this.getBaseUrl(videoId)}/${commentId}`)
  }

  async fetchReplies(
    videoId: string,
    commentId: string,
    pageOptions: PaginationOptions,
  ): Promise<PaginatedList<CommentReply>> {
    const res = await this.httpClient.get<VideoCommentRepliesDto>(
      `${this.getBaseUrl(videoId)}/${commentId}/replies`,
      {
        params: pageOptions,
      },
    )
    return CommentReplyMapper.toPaginatedModel(res.data)
  }

  async getReply(videoId: string, commentId: string, replyId: string): Promise<CommentReply> {
    const res = await this.httpClient.get<VideoCommentReplyDto>(
      `${this.getBaseUrl(videoId)}/${commentId}/replies/${replyId}`,
    )
    return CommentReplyMapper.toModel(res.data)
  }

  async createReply(command: CommentReplyCreateCommand): Promise<CommentReply> {
    const dto = CommentReplyMapper.toCreateDto(command)
    const res = await this.httpClient.post<VideoCommentReplyDto>(
      `${this.getBaseUrl(command.videoId)}/${command.commentId}/replies`,
      dto,
    )
    return CommentReplyMapper.toModel(res.data)
  }

  async updateReply(command: CommentReplyUpdateCommand): Promise<CommentReply> {
    const dto = CommentReplyMapper.toUpdateDto(command)
    const res = await this.httpClient.patch<VideoCommentReplyDto>(
      `${this.getBaseUrl(command.videoId)}/${command.commentId}/replies/${command.replyId}`,
      dto,
    )
    return CommentReplyMapper.toModel(res.data)
  }

  async deleteReply(videoId: string, commentId: string, replyId: string): Promise<void> {
    await this.httpClient.delete(`${this.getBaseUrl(videoId)}/${commentId}/replies/${replyId}`)
  }
}
