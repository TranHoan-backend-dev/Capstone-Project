
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export const POST = async (req: Request) => {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const buffer = Buffer.from(await (file as Blob).arrayBuffer());

    // Create a simplified filename to avoid weird chars, but keep extension
    const originalName = (file as File).name.replaceAll(" ", "_");
    const filename = Date.now() + "_" + originalName;

    try {
        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        return NextResponse.json({
            Message: "Success",
            status: 201,
            url: `/uploads/${filename}`
        });
    } catch (error) {
        console.log("Error occurred ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
