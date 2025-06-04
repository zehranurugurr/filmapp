import { tool } from '@mastra/core/tool';

// This is a placeholder for FilmsTool.
// You will need to replace this with the actual implementation of your film retrieval logic.
// It should interact with a film database or API.
export const FilmsTool = tool({
  name: 'get_films',
  description: 'Retrieve a list of films based on various criteria like genre, mood, director, or actor.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The user\'s request for film recommendations, e.g., "romantic comedy", "sci-fi like Interstellar", "movies starring Tom Hanks".',
      },
    },
    required: ['query'],
  },
  execute: async ({ query }: { query: string }) => {
    // Simulate fetching film data. Replace with actual API call to a film database.
    console.log(`Executing FilmsTool with query: ${query}`);
    const mockFilms = [
      { title: 'The Grand Budapest Hotel', genre: 'Comedy', mood: 'Whimsical', director: 'Wes Anderson' },
      { title: 'Inception', genre: 'Sci-Fi', mood: 'Mind-bending', director: 'Christopher Nolan' },
      { title: 'La La Land', genre: 'Musical, Romance', mood: 'Bittersweet', director: 'Damien Chazelle' },
      { title: 'Eternal Sunshine of the Spotless Mind', genre: 'Romance, Sci-Fi', mood: 'Thought-provoking', director: 'Michel Gondry' },
    ];

    const filteredFilms = mockFilms.filter(film =>
      film.genre.toLowerCase().includes(query.toLowerCase()) ||
      film.mood.toLowerCase().includes(query.toLowerCase()) ||
      film.title.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredFilms.length > 0) {
      return { films: filteredFilms.map(f => f.title).join(', ') };
    } else {
      return { films: 'Belirtilen kriterlere uygun film bulunamadı.' };
    }
  },
});