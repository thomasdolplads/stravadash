import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {Activity} from "@/app/lib/definitions";

interface FetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
}

export async function fetchStravaApi(endpoint: string, options: FetchOptions = {}): Promise<any> {
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

    console.log('fetching from:: ', `${baseUrl}/api/strava/${endpoint}`)
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

export async function fetchActivities(endpoint: string, options: FetchOptions = {}): Promise<Activity[]> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const accessToken = (await cookies()).get('access_token')?.value;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60 * 1000); // Set a 1-minute timeout
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
        throw new Error(`Missing stravatoken: ${403}`);
    }

    try {
        const url = `${baseUrl}/api/strava/${endpoint}`
        const response = await fetch(url, {
            method: 'GET',
            headers,
            signal: controller.signal, // Pass the AbortController signal to the fetch request
        });

        const data: Activity[] = await response.json();
        if (!response.ok) {
            console.error('API error:', data);
        }

        return data;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error(`Request timed out: ${408}`);
        }
        throw new Error(`Unexpected error: ${500}`);
    } finally {
        clearTimeout(timeout);
    }
}

export async function fetchClubActivities(clubId: string): Promise<Activity[]> {
    const response = await fetch(`/api/strava/clubs/${clubId}/activities`);

    if (!response.ok) {
        throw new Error(`Failed to fetch club activities. Status code: ${response.status}`);
    }

    return await response.json();
}