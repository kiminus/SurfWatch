export interface CrowdDensityData {
    time: string, // should be in format 2022-04-02 21:23:12
    desity: number
}

export interface BasicSite {
    site_id: number,
    site_name: string,
    site_desc: string,
    site_predict_crowdness: CrowdDensityData[] 
}

export interface Site extends BasicSite {
    site_predict_hourly_crowdness: CrowdDensityData[]
}