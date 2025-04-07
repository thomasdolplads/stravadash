import {cookies} from "next/headers";

interface FetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
}

export async function fetchStravaApi(endpoint: string, options: FetchOptions = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const accessToken = (await cookies()).get('access_token')?.value;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
        return {}
    }

    const response = await fetch(`${baseUrl}/api/strava/${endpoint}`, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('API error:', data);
        throw new Error(data.error || 'Failed to fetch data');
    }

    return data;
}