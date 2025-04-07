import {Signup} from "@/app/ui/signup";
import {fetchStravaApi} from "@/app/lib/strava-api";


export default async function Page() {
    const athlete = await fetchStravaApi('athlete');

    return <>
        <h1>Dashboard</h1>
        <div>Logged in as: {athlete.firstname} {athlete.lastname}</div>
        <Signup/>
    </>;
}