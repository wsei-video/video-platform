import type { PaginatedList, PaginationOptions } from '../shared/types'
import type {
  CreateCommentReactionCommand,
  CreateVideoReactionCommand,
  DeleteCommentReactionCommand,
  DeleteVideoReactionCommand,
} from './reaction.commands'
import type { CommentReaction, VideoReaction } from './reaction.model'

export interface ReactionRepository {
  createVideoReaction(command: CreateVideoReactionCommand): Promise<VideoReaction>
  deleteVideoReaction(command: DeleteVideoReactionCommand): Promise<void>
  fetchVideoReactions(
    videoId: string,
    pageOptions: PaginationOptions,
  ): Promise<PaginatedList<VideoReaction>>
  getVideoReaction(videoId: string, reactionId: string): Promise<VideoReaction>
  deleteVideoReactionById(videoId: string, reactionId: string): Promise<void>
  getUserVideoReaction(videoId: string): Promise<VideoReaction | null>

  createCommentReaction(command: CreateCommentReactionCommand): Promise<CommentReaction>
  deleteCommentReaction(command: DeleteCommentReactionCommand): Promise<void>
  fetchCommentReactions(
    videoId: string,
    commentId: string,
    pageOptions: PaginationOptions,
  ): Promise<PaginatedList<CommentReaction>>
  getCommentReaction(videoId: string, commentId: string, reactionId: string): Promise<CommentReaction>
  deleteCommentReactionById(videoId: string, commentId: string, reactionId: string): Promise<void>
  getUserCommentReaction(videoId: string, commentId: string): Promise<CommentReaction | null>
}
