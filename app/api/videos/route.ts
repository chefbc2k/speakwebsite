import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!);

export async function GET() {
  try {
    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      throw new Error('Mux API credentials are not set');
    }

    const assets = await Video.Assets.list();
    const videos = assets.map((asset) => ({
      id: asset.id,
      title: asset.filename || 'Untitled',
      playbackId: asset.playback_ids?.[0]?.id,
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}