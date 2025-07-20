/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Creator {
  nickname: string;
  photoUrl: string;
}

export interface Video {
  creator: Creator;
  description: string;
  duration: number;
  hlsUrl: string;
  id: string;
  reactions: VideoReaction[];
  thumbnail: string;
  title: string;
  /** @format date-time */
  uploadedDate: string;
  views: number;
}

export interface VideoReaction {
  count: number;
  emoji: string;
}
