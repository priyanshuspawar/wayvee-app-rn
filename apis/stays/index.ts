// src/apis/stays.ts

import { Stay } from '~/utils/responseTypes';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface SearchResponse {
  message: string;
  data: Stay[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const searchStays = async (
  searchQuery: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchResponse> => {
  try {
    // Make sure API_BASE_URL is correct and properly configured
    const baseUrl = API_BASE_URL || 'http://localhost:3000/api';

    // Construct URL with proper query parameters
    const url = new URL(`${baseUrl}/stays/search`);
    url.searchParams.append('query', searchQuery);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    console.log('Searching with URL:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Handle non-OK responses properly
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', response.status, errorText);

      // Try to parse as JSON if possible
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      } catch (parseError) {
        // If it's not valid JSON, use the text directly
        throw new Error(
          `Server error ${response.status}: ${errorText || response.statusText}`
        );
      }
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search error:', error);

    // Return a standardized error response that matches the expected structure
    // This prevents crashes from unexpected response structures
    throw error;
  }
};
