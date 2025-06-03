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
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    const motorcycles = Array.isArray(data) ? data : [data];
    
    const enrichedMotorcycles = motorcycles.map(motorcycle => ({
      make: motorcycle.make || 'Unknown',
      model: motorcycle.model || 'Unknown',
      year: motorcycle.year || new Date().getFullYear(),
      type: motorcycle.type || 'N/A',
      displacement: motorcycle.displacement || 'N/A',
      engine: motorcycle.engine || 'N/A',
      power: motorcycle.power || 'N/A',
      torque: motorcycle.torque || 'N/A',
      compression: motorcycle.compression || 'N/A',
      bore_stroke: motorcycle.bore_stroke || 'N/A',
      valves_per_cylinder: motorcycle.valves_per_cylinder || 'N/A',
      fuel_system: motorcycle.fuel_system || 'N/A',
      fuel_control: motorcycle.fuel_control || 'N/A',
      ignition: motorcycle.ignition || 'N/A',
      lubrication: motorcycle.lubrication || 'N/A',
      cooling: motorcycle.cooling || 'N/A',
      gearbox: motorcycle.gearbox || 'N/A',
      transmission: motorcycle.transmission || 'N/A',
      clutch: motorcycle.clutch || 'N/A',
      frame: motorcycle.frame || 'N/A',
      front_suspension: motorcycle.front_suspension || 'N/A',
      front_wheel_travel: motorcycle.front_wheel_travel || 'N/A',
      rear_suspension: motorcycle.rear_suspension || 'N/A',
      rear_wheel_travel: motorcycle.rear_wheel_travel || 'N/A',
      front_tire: motorcycle.front_tire || 'N/A',
      rear_tire: motorcycle.rear_tire || 'N/A',
      front_brakes: motorcycle.front_brakes || 'N/A',
      rear_brakes: motorcycle.rear_brakes || 'N/A',
      total_weight: motorcycle.total_weight || 'N/A',
      seat_height: motorcycle.seat_height || 'N/A',
      total_height: motorcycle.total_height || 'N/A',
      total_length: motorcycle.total_length || 'N/A',
      total_width: motorcycle.total_width || 'N/A',
      ground_clearance: motorcycle.ground_clearance || 'N/A',
      wheelbase: motorcycle.wheelbase || 'N/A',
      fuel_capacity: motorcycle.fuel_capacity || 'N/A',
      starter: motorcycle.starter || 'N/A',
    }));

    return NextResponse.json(enrichedMotorcycles, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Motorcycle API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch motorcycle data' },
      { status: 500 }
    );
  }
} 