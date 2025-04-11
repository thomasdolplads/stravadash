import {fetchActivities, fetchClubActivities, fetchStravaApi} from "@/app/lib/strava-api";
import {v4 as uuidv4} from 'uuid';

export default async function Page() {
    const activities = await fetchActivities('clubs/1475192/activities')


    return (
        <div>
            <h1>Club Activities</h1>
            <ul>
                {activities.map((activity) => (
                    < li key={uuidv4()}>
                        {activity.name} - {activity.distance} meters
                    </li>
                ))}
            </ul>
        </div>
    );
}
