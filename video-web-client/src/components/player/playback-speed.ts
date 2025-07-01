export type PlaybackSpeedOption = { value: number; label?: string }

export const usePlaybackSpeedOptions = () => {
  const playbackSpeedOptions: PlaybackSpeedOption[] = [
    { value: 0.25 },
    { value: 0.5 },
    { value: 0.75 },
    { value: 1, label: 'Normal' },
    { value: 1.25 },
    { value: 1.5 },
    { value: 1.75 },
    { value: 2 },
  ]

  return playbackSpeedOptions
}
