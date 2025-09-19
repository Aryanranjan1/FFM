import type { Album, Bio, Project } from './types';

export const albums: Album[] = [
  {
    id: 'album-1',
    title: 'Celestial Echoes',
    artist: 'FFM',
    releaseYear: 2023,
    coverArtId: 'album-cover-1',
    tracks: [
      { id: 't1-1', title: 'Stardust', artist: 'FFM', duration: '3:45', audioSrc: '/music/stardust.mp3' },
      { id: 't1-2', title: 'Nebula', artist: 'FFM', duration: '4:12', audioSrc: '/music/nebula.mp3' },
      { id: 't1-3', title: 'Gravity Well', artist: 'FFM', duration: '5:02', audioSrc: '/music/gravity-well.mp3' },
      { id: 't1-4', title: 'Light Speed', artist: 'FFM', duration: '3:30', audioSrc: '/music/light-speed.mp3' },
    ],
  },
  {
    id: 'album-2',
    title: 'Urban Flora',
    artist: 'FFM',
    releaseYear: 2021,
    coverArtId: 'album-cover-2',
    tracks: [
      { id: 't2-1', title: 'Concrete Jungle', artist: 'FFM', duration: '4:05', audioSrc: '/music/concrete-jungle.mp3' },
      { id: 't2-2', title: 'Neon Bloom', artist: 'FFM', duration: '3:55', audioSrc: '/music/neon-bloom.mp3' },
      { id: 't2-3', title: 'Rooftop Garden', artist: 'FFM', duration: '4:20', audioSrc: '/music/rooftop-garden.mp3' },
    ],
  },
    {
    id: 'album-3',
    title: 'Chroma',
    artist: 'FFM',
    releaseYear: 2019,
    coverArtId: 'album-cover-3',
    tracks: [
      { id: 't3-1', title: 'Hue', artist: 'FFM', duration: '3:15', audioSrc: '/music/hue.mp3' },
      { id: 't3-2', title: 'Saturation', artist: 'FFM', duration: '4:00', audioSrc: '/music/saturation.mp3' },
      { id: 't3-3', title: 'Value', artist: 'FFM', duration: '2:50', audioSrc: '/music/value.mp3' },
    ],
  },
];

export const projects: Project[] = [
  { id: 'proj-1', title: 'Aurora', description: 'A vibrant music video capturing the essence of the northern lights.', category: 'Music Video', imageId: 'project-1', date: '2023-10-26' },
  { id: 'proj-2', title: 'Metropolis Live', description: 'A groundbreaking live performance merging electronic music with live orchestral arrangements.', category: 'Live Performance', imageId: 'project-2', date: '2023-08-15' },
  { id: 'proj-3', title: 'Mirage Artwork', description: 'The official single artwork for the track \'Mirage\', a visual representation of sound.', category: 'Artwork', imageId: 'project-3', date: '2022-11-01' },
  { id: 'proj-4', title: 'Etherea Collab', description: 'A collaborative track with artist Nova, exploring ambient and ethereal soundscapes.', category: 'Collaboration', imageId: 'project-4', date: '2022-05-20' },
  { id: 'proj-5', title: 'Odyssey EP BTS', description: 'Behind the scenes footage from the making of the \'Odyssey\' EP.', category: 'Music Video', imageId: 'project-5', date: '2021-09-03' },
];

export const bio: Bio = {
  content: "FFM is a visionary producer and sound designer known for creating immersive auditory experiences. Blending elements of ambient, electronic, and classical music, FFM's work defies genre, transporting listeners to otherworldly realms. Since debuting in 2019 with the album 'Chroma,' FFM has consistently pushed the boundaries of sound, earning critical acclaim and a dedicated global following. Each project is a meticulously crafted journey, a testament to a unique artistic vision that continues to evolve and inspire.",
  pressReleases: [
    { title: 'The Sound of the Future', publication: 'Synth Magazine', date: '2023-11-10', url: '#' },
    { title: 'FFM\'s "Celestial Echoes" is a Masterpiece', publication: 'EDM Weekly', date: '2023-03-22', url: '#' },
    { title: 'An Interview with FFM', publication: 'The Music Journal', date: '2021-07-19', url: '#' },
  ],
};
