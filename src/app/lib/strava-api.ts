import {cookies} from "next/headers";
import {NextResponse} from "next/server";

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

export async function fetchActivities(endpoint: string, options: FetchOptions = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const accessToken = (await cookies()).get('access_token')?.value;
    const perPage = 30; // Define how many results per page you want
    const allActivities: Activity[] = []; // Array to hold all activities
    let page = 1;
    let responseStatus: number | undefined;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60 * 1000); // Set a 1-minute timeout
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
        return {}
    }

    try {
        // add page loop
        const url = `${baseUrl}/api/strava/${endpoint}`
        console.log('fetchto: ', url)
        const response = await fetch(url, {
            method: 'GET',
            headers,
            signal: controller.signal, // Pass the AbortController signal to the fetch request
        });

        const data: Activity[] = await response.json();
        responseStatus = response.status
        if (!response.ok) {
            console.error('API error:', data);
            return NextResponse.json({error: 'Failed to fetch activities'}, {status: responseStatus});
        }

        allActivities.push(...data); // Add the data to the accumulated array

        if (!data || data.length === 0) { // TODO
            // No more data, break the loop
            // return NextResponse.json()
        }

        page++;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            return NextResponse.json({error: 'Request timed out'}, {status: 408}); // HTTP status code for Request Timeout
        }
        return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500});
    } finally {
        clearTimeout(timeout); // Clear the timeout once the request is complete or aborted
    }


    return NextResponse.json(allActivities, {status: responseStatus});
}

interface Activity {
    // Define the structure of an activity based on the Strava API response
    id: number;
    name: string;
    distance: number;
    // Add other fields as needed
}