import {fetchActivities, fetchClubActivities, fetchStravaApi} from "@/app/lib/strava-api";
import {v4 as uuidv4} from 'uuid';
import {Activity} from "@/app/lib/definitions";

export default async function Page() {
    const activities = await fetchActivities('clubs/1475192/activities')

    const card = (activity: Activity) => {
        return <div className="card md:max-w-md">
            <h5 className="card-title mb-2.5">{activity.name} </h5>
            <figure><img src="https://cdn.flyonui.com/fy-assets/components/card/image-9.png" alt="Watch"/></figure>
            <div className="card-body">
                <p className="mb-4">Distanse {activity.distance}</p>
                <div className="card-actions">
                    <button className="btn btn-secondary btn-soft">Details</button>
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <h1>Club Activities</h1>
            <ul>
                {activities.map((activity) => (
                    < li key={uuidv4()}>
                        {card(activity)}

                    </li>
                ))}
            </ul>
        </div>
    );
}
