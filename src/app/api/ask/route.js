import { NextResponse } from 'next/server';
import PipelineSingleton from './pipeline.js';
import pc, { INDEX_NAME, EMBED_MODEL } from '../pinecone.js';

export async function GET(request) {
    const text = request.nextUrl.searchParams.get('text');
    if (!text) {
        return NextResponse.json({
            error: 'Missing text parameter',
        }, { status: 400 });
    }

    try {
        const embedding = await pc.inference.embed(
            EMBED_MODEL,
            [text],
            { inputType: 'query' }
        );
        const queryResponse = await pc.index(INDEX_NAME).query({
            topK: 3,
            vector: embedding[0].values,
            includeValues: false,
            includeMetadata: true
        });

        const context = queryResponse.matches.map((match) => match.metadata.text).join(' ');

        const answerer = await PipelineSingleton.getInstance();

        const result = await answerer(text, context);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error handling request:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
        }, { status: 500 });
    }
}
