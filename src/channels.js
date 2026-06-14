const channels = [
  // --- Telemadrid ---
  {
    id: 1,
    name: 'Telemadrid',
    logo: '📺',
    country: 'España',
    category: 'Generalista',
    url: 'https://live.telemadrid.cross-media.es/6389770581112/eu-central-1/6416060453001/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiajI5YjgyLmVncmVzcy5haGc3NmwiLCJhY2NvdW50X2lkIjoiNjQxNjA2MDQ1MzAwMSIsImVobiI6ImxpdmUudGVsZW1hZHJpZC5jcm9zcy1tZWRpYS5lcyIsImlzcyI6ImJsaXZlLXBsYXliYWNrLXNvdXJjZS1hcGkiLCJzdWIiOiJwYXRobWFwdG9rZW4iLCJhdWQiOlsiNjQxNjA2MDQ1MzAwMSJdLCJqdGkiOiI2Mzg5NzcwNTgxMTEyIn0.kqriAMUkHT6m0V6wkCHJum_EUyL4PAi1zJMKlfmYHEU/playlist-hls.m3u8',
    type: 'hls',
    live: true,
  },
  {
    id: 2,
    name: 'La Otra',
    logo: '🎬',
    country: 'España',
    category: 'Entretenimiento',
    url: 'https://live.telemadrid.cross-media.es/6389770474112/eu-central-1/6416060453001/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiajI5YjgyLmVncmVzcy5haGc3NmwiLCJhY2NvdW50X2lkIjoiNjQxNjA2MDQ1MzAwMSIsImVobiI6ImxpdmUudGVsZW1hZHJpZC5jcm9zcy1tZWRpYS5lcyIsImlzcyI6ImJsaXZlLXBsYXliYWNrLXNvdXJjZS1hcGkiLCJzdWIiOiJwYXRobWFwdG9rZW4iLCJhdWQiOlsiNjQxNjA2MDQ1MzAwMSJdLCJqdGkiOiI2Mzg5NzcwNDc0MTEyIn0.1KSxZK60xNAZZsa7dbYR8Equ8aG930d6qFDsYKUmmdE/playlist-hls.m3u8',
    type: 'hls',
    live: true,
  },

  // --- RTVE ---
  {
    id: 3,
    name: 'La 1',
    logo: '1️⃣',
    country: 'España',
    category: 'Pública',
    url: 'https://ztnr.rtve.es/ztnr/1688877.m3u8',
    type: 'hls',
    live: true,
  },
  {
    id: 4,
    name: 'La 2',
    logo: '2️⃣',
    country: 'España',
    category: 'Pública',
    url: 'https://ztnr.rtve.es/ztnr/5468585.m3u8',
    type: 'hls',
    live: true,
  },
  {
    id: 5,
    name: 'Canal 24 Horas',
    logo: '🗞️',
    country: 'España',
    category: 'Noticias',
    url: 'https://ztnr.rtve.es/ztnr/1694255.m3u8',
    type: 'hls',
    live: true,
  },
  {
    id: 6,
    name: 'Clan TVE',
    logo: '🧒',
    country: 'España',
    category: 'Infantil',
    url: 'https://ztnr.rtve.es/ztnr/5466990.m3u8',
    type: 'hls',
    live: true,
  },

  // --- Canal Sur ---
  {
    id: 7,
    name: 'Canal Sur Andalucía',
    logo: '🌞',
    country: 'España',
    category: 'Regional',
    url: 'https://dfk2a268yviz9.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-ddiii1m6jt6of/CanalSurAndaluciaES.m3u8',
    type: 'hls',
    live: true,
  },
  {
    id: 8,
    name: 'Canal Sur Noticias',
    logo: '📰',
    country: 'España',
    category: 'Noticias',
    url: 'https://cdnlive.codev8.net/rtvalive/smil:channel42.smil/playlist.m3u8',
    type: 'hls',
    live: true,
  },

  // --- À Punt ---
  {
    id: 9,
    name: 'À Punt',
    logo: '🟠',
    country: 'España',
    category: 'Regional',
    url: 'http://92.176.119.180:2095/play/a17d',
    type: 'hls',
    live: true,
  },

  // --- Deportes ---
  {
    id: 10,
    name: 'Real Madrid TV',
    logo: '⚽',
    country: 'España',
    category: 'Deportes',
    url: 'https://rmtv.akamaized.net/hls/live/2043153/rmtv-es-web/master.m3u8',
    type: 'hls',
    live: true,
  },
];

export default channels;
