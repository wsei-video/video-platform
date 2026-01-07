import type { PaginatedList, PaginationOptions } from '../shared/types'
import type {
  CommentCreateCommand,
  CommentReplyCreateCommand,
  CommentReplyUpdateCommand,
  CommentUpdateCommand,
} from './comment.commands'
import type { Comment } from './comment.model'
import type { CommentReply } from './comment-reply.model'

export interface CommentRepository {
  fetchComments(videoId: string, pageOptions: PaginationOptions): Promise<PaginatedList<Comment>>
  getComment(videoId: string, commentId: string): Promise<Comment>
  createComment(command: CommentCreateCommand): Promise<Comment>
  updateComment(command: CommentUpdateCommand): Promise<Comment>
  deleteComment(videoId: string, commentId: string): Promise<void>

  fetchReplies(
    videoId: string,
    commentId: string,
    pageOptions: PaginationOptions,
  ): Promise<PaginatedList<CommentReply>>
  getReply(videoId: string, commentId: string, replyId: string): Promise<CommentReply>
  createReply(command: CommentReplyCreateCommand): Promise<CommentReply>
  updateReply(command: CommentReplyUpdateCommand): Promise<CommentReply>
  deleteReply(videoId: string, commentId: string, replyId: string): Promise<void>
}
