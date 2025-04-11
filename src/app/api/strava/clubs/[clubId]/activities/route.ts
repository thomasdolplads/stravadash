import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
    const perPage = 30; // Define how many results per page you want
    const allActivities: Activity[] = []; // Array to hold all activities
    let page = 1;

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
        while (true) {
            const url = `https://www.strava.com/api/v3/clubs/1475192/activities?page=${page}&per_page=30`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': authHeader
                }
            });
            const data = await response.json();
            if (!response.ok) {
                return NextResponse.json(data, {status: response.status})
            }

            if (!data || data.length === 0) {
                break; // Break the loop if there are no more activities
            }

            allActivities.push(...data); // Accumulate activities
            page++;

        }
        return NextResponse.json(allActivities, {status: 200})
    } catch (error) {
        console.error('Error proxying to Strava:', error);
        return NextResponse.json(
            {error: 'Failed to fetch data from Strava'},
            {status: 500}
        );
    }
}