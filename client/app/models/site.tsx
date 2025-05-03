// TypeScript interfaces based on site.py Pydantic models

/**
 * Represents crowdness data at a specific time.
 * Corresponds to the Python Crowdness model.
 */
export interface Crowdness {
  time: string; // UTC time in ISO format
  crowdness: number; // number of people in the site at that time
}

/**
 * Represents wave quality data at a specific time.
 * Corresponds to the Python WaveQuality model.
 */
export interface WaveQuality {
  time: string; // UTC time in ISO format
  quality: number; // wave quality rating (0-10)
  tide: 'low' | 'mid' | 'high'; // tide level
}

/**
 * Represents very basic site information.
 * Corresponds to the Python SiteShort model.
 */
export interface SiteShort {
  site_id: number;
  site_name: string;
  site_name_short: string;
}

/**
 * Represents detailed site information.
 * Extends SiteShort.
 * Corresponds to the Python SiteDetails model.
 */
export interface SiteDetails extends SiteShort {
  site_desc: string;
  site_url: string;
  site_banner_url?: string | null; // Optional field
  predict_daily_crowdness?: Crowdness[] | null; // Optional list of Crowdness objects
}

/**
 * Represents full site information including hourly predictions.
 * Extends SiteDetails.
 * Corresponds to the Python Site model.
 */
export interface Site extends SiteDetails {
  predict_hourly_crowdness?: Crowdness[] | null; // Optional list of Crowdness objects
  predict_hourly_wave_quality?: WaveQuality[] | null; // Optional list of WaveQuality objects
}
