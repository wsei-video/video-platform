export interface Video {
  id: string;
  title: string;
  description: string;
  hlsUrl: string;
  thumbnail: string;
  reactions: Reaction[];
  duration: number;
  creator: Creator;
  uploadedDate: Date;
  views: number;
}
export interface Reaction {
  emoji: string;
  count: number;
}

export interface Creator {
  nickname: string;
  photoUrl: string;
}

export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Big Buck Bunny - adaptive qualities',
    description: 'Big Buck Bunny - adaptive qualities - description',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://picsum.photos/300',
    duration: 4000,
    creator: {
      nickname: 'John Doe',
      photoUrl: 'https://picsum.photos/300',
    },
    reactions: [
      { emoji: '😁', count: 30 },
      { emoji: '❤️', count: 15 },
      { emoji: '👍', count: 10 },
    ],
    uploadedDate: new Date(),
    views: 20000,
  },
  {
    id: '2',
    title: 'Big Buck Bunny - 480p only',
    description: 'Big Buck Bunny - 480p only - description',
    hlsUrl: 'http://example.com/video2',
    thumbnail: 'https://picsum.photos/300',
    duration: 4000,
    creator: {
      nickname: 'John Doe',
      photoUrl: 'https://picsum.photos/300',
    },
    reactions: [
      { emoji: '😁', count: 30 },
      { emoji: '❤️', count: 15 },
      { emoji: '👍', count: 10 },
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
    creator: {
      nickname: 'John Doe',
      photoUrl: 'https://picsum.photos/300',
    },
    reactions: [
      { emoji: '😁', count: 30 },
      { emoji: '❤️', count: 15 },
      { emoji: '👍', count: 10 },
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
    creator: {
      nickname: 'John Doe',
      photoUrl: 'https://picsum.photos/300',
    },
    reactions: [
      { emoji: '😁', count: 30 },
      { emoji: '❤️', count: 15 },
      { emoji: '👍', count: 10 },
    ],
    uploadedDate: new Date(),
    views: 20000,
  },
] as const;
