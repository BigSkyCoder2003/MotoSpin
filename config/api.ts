export const MOTORCYCLE_API_URL = 'https://api.api-ninjas.com/v1/motorcycles';
export const API_KEY = process.env.NEXT_PUBLIC_API_NINJAS_KEY || '';

export const fetchMotorcycle = async (make?: string, model?: string) => {
  const params = new URLSearchParams();
  if (make) params.append('make', make);
  if (model) params.append('model', model);
  
  const response = await fetch(
    `${MOTORCYCLE_API_URL}${params.toString() ? '?' + params.toString() : ''}`,
    {
      headers: {
        'X-Api-Key': API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch motorcycle data');
  }

  return response.json();
};
