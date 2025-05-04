/**
 * Corresponds to Crowdness in Python
 */
export interface Crowdness {
  /** UTC time in ISO format */
  time: string;
  /** number of people in the site at that time */
  crowdness: number;
}

/**
 * Corresponds to WaveQuality in Python
 */
export interface WaveQuality {
  /** UTC time in ISO format */
  time: string;
  /** wave quality rating (0-10) */
  quality: number;
  /** tide level (low, mid, high) */
  tide: string; // Consider using an enum: 'low' | 'mid' | 'high'
}

/**
 * very basic site info
 * Corresponds to SiteShort in Python
 */
export interface SiteShort {
  site_id: number;
  site_name: string;
  site_name_short: string;
}

/**
 * detailed site info
 * Corresponds to SiteDetails in Python
 * Extends SiteShort
 */
export interface SiteDetails extends SiteShort {
  site_desc: string;
  site_url: string;
  site_banner_url?: string | null; // Optional field with default None maps to optional or null
  predict_daily_crowdness?: Crowdness[] | null; // Optional list maps to array or null
}

/**
 * full site info
 * Corresponds to Site in Python
 * Extends SiteDetails
 */
export interface Site extends SiteDetails {
  predict_hourly_crowdness?: Crowdness[] | null; // Optional list maps to array or null
  predict_hourly_wave_quality?: WaveQuality[] | null; // Optional list maps to array or null
}