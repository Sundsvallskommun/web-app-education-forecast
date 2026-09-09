import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@services/api-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const requireAuth = process.env.HEALTH_AUTH === 'true';
  const expected = Buffer.from(`${process.env.HEALTH_USERNAME}:${process.env.HEALTH_PASSWORD}`).toString('base64');

  if (requireAuth && req.headers.get('authorization') !== `Basic ${expected}`) {
    return new NextResponse('Not Authorized', { status: 401 });
  }

  try {
    const health = await apiService.get('health/up').then((res) => res.data);
    return NextResponse.json(health);
  } catch (error) {
    console.log('health error', error);
    return NextResponse.json({ status: 'ERROR!' }, { status: 500 });
  }
}
