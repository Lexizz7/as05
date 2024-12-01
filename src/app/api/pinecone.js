import { Pinecone } from '@pinecone-database/pinecone';

const INDEX_NAME = 'qa-pdf';
const EMBED_MODEL = 'multilingual-e5-large';

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export { pc as default, INDEX_NAME, EMBED_MODEL };