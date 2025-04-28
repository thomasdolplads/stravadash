import {NextRequest, NextResponse} from 'next/server';
import {Activity} from "@/app/lib/definitions";

export async function GET(request: NextRequest) {
    const allActivities: Activity[] = [];
    let page = 1;

    try {
        const searchParams = request.nextUrl.searchParams;
        const activityId = searchParams.get('activityId');
        const authHeader = request.headers.get('Authorization');
        console.log('Stravarequest:: ', authHeader)

        if (!authHeader) {
            return NextResponse.json(
                {error: 'No authorization token found'},
                {status: 401}
            );
        }
        while (true) {
            const url = `https://www.strava.com/api/v3/clubs/activities/${activityId}`;
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