export type PersonalizationOptions = {
  daily_time_availability: DailyTimeAvailability;
  total_duration: DailyTimeAvailability;
  skill_level: string;
  additional_info: string;
};

export type DailyTimeAvailability = {
  value: number;
  unit: string;
};

export default PersonalizationOptions;
