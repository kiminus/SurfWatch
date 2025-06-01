// Base model for Site and its related predictions

/**
 * Interface representing the structure of daily crowdness predictions for a site.
 * Corresponds to the SQLAlchemy 'DailyCrowdnessPrediction' model.
 */
export interface DailyCrowdnessPrediction {
  site_id: number; // Foreign key to sites.site_id, also primary key
  h0: number;
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  h7: number;
  h8: number;
  h9: number;
  h10: number;
  h11: number;
  h12: number;
  h13: number;
  h14: number;
  h15: number;
  h16: number;
  h17: number;
  h18: number;
  h19: number;
  h20: number;
  h21: number;
  h22: number;
  h23: number;
  // The 'sites' relationship back to Site is represented by this record being nested
  // or linked within a Site object in TypeScript, typically via 'daily_prediction'.
}

/**
 * Interface representing the structure of weekly crowdness predictions for a site.
 * Corresponds to the SQLAlchemy 'WeeklyCrowdnessPrediction' model.
 */
export interface WeeklyCrowdnessPrediction {
  site_id: number; // Foreign key to sites.site_id, also primary key
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
  Sunday: number;
  // The 'sites' relationship back to Site is represented by this record being nested
  // or linked within a Site object in TypeScript, typically via 'weekly_prediction'.
}
export interface WaveQuality {
  site_id: number;
  wave_height: number;
  wave_speed: number;
  wave_direction: string;
  temperature: number;
}

/**
 * Interface representing a tourism site or location.
 * Corresponds to the SQLAlchemy 'Site' model.
 */
export interface Site {
  site_id: number;
  site_name: string;
  site_name_short: string;
  site_desc: string | null;
  site_url: string | null;
  site_banner_url: string | null;
  daily_prediction?: DailyCrowdnessPrediction | null; // Relationship: one-to-one or null
  weekly_prediction?: WeeklyCrowdnessPrediction | null; // Relationship: one-to-one or null
  // raw_crowdness_readings could be an array here if you were to define that relationship
  // on the Site model in SQLAlchemy (e.g., readings: Mapped[list["RawCrowdnessReading"]])
  wave_quality?: WaveQuality | null;
}
