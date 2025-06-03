export const fetchMotorcycle = async (make?: string, model?: string, year?: number) => {
  const params = new URLSearchParams();
  if (make) params.append('make', make);
  if (model) params.append('model', model);
  if (year) params.append('year', year.toString());

  const queryString = params.toString();
  const url = `/api/motorcycles${queryString ? '?' + queryString : ''}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch motorcycle data');
  }

  const data = await response.json();
  
  // Return array of motorcycles with all available specs
  return Array.isArray(data) ? data : [data];
}; 