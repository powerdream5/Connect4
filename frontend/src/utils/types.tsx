export type AvailabilityData = {
  busy: {
    start: string;
    end: string;
  }[];
  timezone: string;
  workingHours: {
    days: number[];
    startTime: number;
    endTime: number;
    userId: number;
  };
};

export type AvailabilityInput = {
  userId: number;
  availability: AvailabilityData;
};
