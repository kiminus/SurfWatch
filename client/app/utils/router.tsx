import 'react'
import { BasicSite, Site } from '../models/site'
import { User} from '../models/user'

const sites: Site[] = [
    {
        site_id: 1,
        site_name: "La Jolla Beach",
        site_desc: "A good place to surf",
        site_predict_crowdness: [
            {
                time: "2025-04-15",
                desity: 10
            },
                                {
                time: "2025-04-16",
                desity: 12
            },
                                {
                time: "2025-04-17",
                desity: 20
            }
        ],
        site_predict_hourly_crowdness: [
            {
                time: "2025-04-17 10:00:00",
                desity: 6
            },
            {
                time: "2025-04-17 11:00:00",
                desity: 9
            },
            {
                time: "2025-04-17 12:00:00",
                desity: 12
            },
            {
                time: "2025-04-17 13:00:00",
                desity: 13
            },
        ]
    }
]

const users: User[] = [
    {
        user_id: 1,
        user_name: "test",
        email: "asdf@gmail.com",
        avatar_url: "is"
    }
]
export default {
    getRecommandedSites(): BasicSite[] {
    }
}