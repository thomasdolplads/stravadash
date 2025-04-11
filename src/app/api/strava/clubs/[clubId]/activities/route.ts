import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get the Authorization header that middleware added
        const authHeader = request.headers.get('Authorization');
        console.log('Stravarequest:: ', authHeader)

        if (!authHeader) {
            return NextResponse.json(
                {error: 'No authorization token found'},
                {status: 401}
            );
        }
        const url = 'https://www.strava.com/api/v3/clubs/1475192/activities?page=1&per_page=1'
        // Forward the request to Strava API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authHeader
            }
        });

        const data = await response.json();
        console.log('Stravaresponse:: ', JSON.stringify(data), ' status:: ', response.status)
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        console.error('Error proxying to Strava:', error);
        return NextResponse.json(
            {error: 'Failed to fetch data from Strava'},
            {status: 500}
        );
    }
}