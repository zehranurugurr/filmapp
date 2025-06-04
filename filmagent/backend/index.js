import express from 'express';
import { dicAgent } from '../dist//mastra/agents/agent.js'; 

const app = express();
app.use(express.json());

app.post('/define', async (req, res) => {
  const { word } = req.body;
  if (!word) return res.status(400).json({ error: 'Word is required' });

  try {
    const response = await agent.call({
  input: {
    word: "book"
  }
});
    res.json({ result: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Agent API running on http://localhost:3000'));

