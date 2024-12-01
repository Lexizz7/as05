import { NextResponse } from 'next/server';
import pc, { INDEX_NAME, EMBED_MODEL } from '../pinecone.js';
import PDFParser from "pdf2json";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files');

        if (!files || files.length === 0) {
            return NextResponse.json({
                error: 'No files provided in the request',
            }, { status: 400 });
        }

        const extractTextFromPDF = (buffer) =>
            new Promise((resolve, reject) => {
                const pdfParser = new PDFParser();
                pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError));
                pdfParser.on("pdfParser_dataReady", (pdfData) => {
                    const text = pdfData.Pages.map(page => page.Texts.map(text => text.R.map(char =>
                        decodeURIComponent(char.T)
                    ).join('')).join('')).join(' ');
                    resolve(text);
                });
                pdfParser.parseBuffer(buffer);
            });

        const extractedTexts = await Promise.all(
            files.map(async (file) => {
                const buffer = await file.arrayBuffer();
                return extractTextFromPDF(Buffer.from(buffer));
            })
        );

        const embedding = await pc.inference.embed(
            EMBED_MODEL,
            extractedTexts,
            { inputType: 'passage', truncate: 'END' }
        );

        const vectors = extractedTexts.map((text, i) => ({
            id: `doc-${i}`,
            values: embedding[i].values,
            metadata: { text },
        }));

        await pc.index(INDEX_NAME).upsert(vectors);

        return NextResponse.json({
            message: 'Successfully processed the PDF files',
        });

    } catch (error) {
        console.error('Error handling request:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
        }, { status: 500 });
    }
}