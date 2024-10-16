import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!);

export async function POST(request: Request) {
  if (!request.body) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const asset = await Video.Assets.create({
      input: [{ type: 'buffer', contents: buffer }],
      playback_policy: 'public',
    });

    return NextResponse.json({ assetId: asset.id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}