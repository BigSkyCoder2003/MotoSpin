import { NextRequest, NextResponse } from 'next/server';

const MOTORCYCLE_API_URL = 'https://api.api-ninjas.com/v1/motorcycles';
const API_KEY = process.env.API_NINJAS_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');
    
    const params = new URLSearchParams();
    if (make) params.append('make', make);
    if (model) params.append('model', model);
    if (year) params.append('year', year);

    const externalApiUrl = `${MOTORCYCLE_API_URL}${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(externalApiUrl, {
      headers: {
        'X-Api-Key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Motorcycle API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch motorcycle data' },
      { status: 500 }
    );
  }
} 