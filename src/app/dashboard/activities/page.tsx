import {fetchActivities, fetchStravaApi} from "@/app/lib/strava-api";

export default async function Page() {
    //const athlete = await fetchStravaApi('athlete');
    const activites = await fetchActivities('clubs/1475192/activities');
    console.log('activites:: ', activites)
    return (
        <>
            <div>Logged in</div>
        </>
    )
}
