export interface TokenData {
    access_token: string;
    athlete: Athlete;
}

export interface Athlete {
    id: string;
    firstname: string;
    profile_medium: string;
}

export interface Activity {
    // Define the structure of an activity based on the Strava API response
    id: number;
    name: string;
    distance: number;
    // Add other fields as needed
}
