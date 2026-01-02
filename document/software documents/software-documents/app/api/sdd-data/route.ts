
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, readFile, mkdir } from 'fs/promises';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'sdd-data.json');

export async function GET() {
    try {
        const data = await readFile(DATA_FILE_PATH, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        // If file doesn't exist, return null or empty object, client will use defaults
        return NextResponse.json(null);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Ensure directory exists
        const dir = path.dirname(DATA_FILE_PATH);
        await mkdir(dir, { recursive: true });

        await writeFile(DATA_FILE_PATH, JSON.stringify(body, null, 2), 'utf-8');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to save SDD data:", error);
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}
