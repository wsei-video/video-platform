import { VideoVisibility } from './video.dto';

export interface Video {
  id: string;
  title: string;
  description: string;
  hlsUrl: string;
  thumbnail: string;
  reactions: Reaction[];
  comments: Comment[];
  duration: number;
  creator: Creator;
  uploadedDate: Date;
  views: number;
  visibility: VideoVisibility;
}
export interface Reaction {
  emoji: string;
  count: number;
}

export interface Comment {
  id: string;
  creator: Creator;
  postDate: Date;
  content: string;
}

export interface Creator {
  nickname: string;
  photoUrl: string;
}

export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title:
      "Big Buck Bunny - adaptive qualities, test for a super long video title that doesn't fit on the screen so what will i do with it???",
    description:
      'Big Buck Bunny - adaptive qualities - description,Big Buck Bunny - adaptive qualities - description, Big Buck Bunny - adaptive qualities - description, Big Buck Bunny - adaptive qualities - description, Big Buck Bunny - adaptive qualities - description',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://picsum.photos/300',
    duration: 4000,
    visibility: VideoVisibility.PUBLIC,
    creator: {
      nickname: 'John Doe',
      photoUrl: 'https://picsum.photos/300',
    },
    reactions: [
      { emoji: '😁', count: 9 },
      { emoji: '❤️', count: 15 },
      { emoji: '👍', count: 10 },
    ],
    comments: [
      {
        id: '111',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: "Cool video. Can't wait to watch more productions from you",
      },
      {
        id: '222',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Bad video',
      },
      {
        id: '333',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Hi i think this is a very interesting video. Keep up the good work :)',
      },
    ],
    uploadedDate: new Date('2025-02-20'),
    views: 20000,
  },
  {
    id: '2',
    title: 'Big Buck Bunny - 480p only',
    description: 'Big Buck Bunny - 480p only - description',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8',
    thumbnail: 'https://picsum.photos/300',
    duration: 4000,
    visibility: VideoVisibility.PUBLIC,
    creator: {
      nickname: 'John Doe',
      photoUrl: 'https://picsum.photos/300',
    },
    reactions: [
      { emoji: '😁', count: 30 },
      { emoji: '❤️', count: 15 },
      { emoji: '👍', count: 10 },
    ],
    comments: [
      {
        id: '211',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Cool video',
      },
      {
        id: '212',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date('2025-02-20'),
        content: 'Bad video',
      },
      {
        id: '213',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Cringe',
      },
    ],
    uploadedDate: new Date(),
    views: 20000,
  },
  {
    id: '3',
    title: 'ARTE China, ABR',
    description: 'ARTE China, ABR - description',
    hlsUrl: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    thumbnail: 'https://picsum.photos/300',
    duration: 4000,
    visibility: VideoVisibility.PUBLIC,
    creator: {
      nickname: 'John Doe',
      photoUrl: 'https://picsum.photos/300',
    },
    reactions: [
      { emoji: '😁', count: 30 },
      { emoji: '❤️', count: 15 },
      { emoji: '👍', count: 10 },
      { emoji: '🫣', count: 5 },
    ],
    comments: [
      {
        id: '311',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Cool video',
      },
      {
        id: '312',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Bad video',
      },
      {
        id: '313',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Cringe',
      },
    ],
    uploadedDate: new Date(),
    views: 20000,
  },
  {
    id: '4',
    title: 'Tears of Steel, HLS with IMSC Captions',
    description: 'Tears of Steel, HLS with IMSC Captions - description',
    hlsUrl: 'https://test-streams.mux.dev/tos_ismc/main.m3u8',
    thumbnail: 'https://picsum.photos/300',
    duration: 4000,
    visibility: VideoVisibility.PUBLIC,
    creator: {
      nickname: 'John Doe',
      photoUrl: 'https://picsum.photos/300',
    },
    reactions: [
      { emoji: '😁', count: 30 },
      { emoji: '❤️', count: 15 },
      { emoji: '👍', count: 10 },
    ],
    comments: [
      {
        id: '411',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Cool video',
      },
      {
        id: '412',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Bad video',
      },
      {
        id: '413',
        creator: { nickname: 'Jane Doe', photoUrl: 'https://picsum.photos/300' },
        postDate: new Date(),
        content: 'Cringe',
      },
    ],
    uploadedDate: new Date(),
    views: 20000,
  },
] as const;
