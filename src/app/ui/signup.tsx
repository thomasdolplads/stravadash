'use client'

import {useActionState, useEffect} from 'react'

export function Signup() {
    //const [state, formAction, pending] = useActionState(fetchToken('24125', 'ja', 'da'), initialState)


    return (
        <>
            <a
                href="http://www.strava.com/oauth/authorize?client_id=24125&response_type=code&redirect_uri=http://localhost:3000/api/auth&approval_prompt=force&scope=read"
                className="inline-block px-6 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Login with Strava
            </a>
        </>
    )
}