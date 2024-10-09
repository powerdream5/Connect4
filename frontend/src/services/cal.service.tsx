import axios from "axios";
import moment, { Moment } from "moment-timezone";
import {
  AVAILABILITY_MODE_ALL,
  AVAILABILITY_MODE_ANY,
} from "../utils/constant";
import { AvailabilityInput } from "../utils/types";
import { getFirstAndLastDayOfMonth, getToday } from "../utils/helper";

export default class CalSerice {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:3003/v1",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async fetchSlots(date?: string): Promise<{ time: string }[]> {
    const target = date ?? getToday();
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth(target);
    try {
      const params = {
        usernameList: "ca-tx",
        eventTypeSlug: "15-new-patient",
        startTime: firstDay,
        endTime: lastDay,
        timeZone: "America/Los_Angeles",
        apiKey: "cal_4fec7a7306b78dd1b3bfb3ad40d2d367",
      };
      const res = await this.axiosInstance.get("/slots", { params });

      const { data } = res;
      return data.slots[target] || [];
    } catch (error) {
      console.log(error);
    }

    return [];
  }

  findAvailableSlots(
    availabilityData: AvailabilityInput[],
    targetDate: string,
    targetTimezone: string,
    periodMinutes: number,
    availabilityModel: string
  ): string[] {
    const targetDayOfWeek = moment(targetDate).isoWeekday();
    const targetDateStart = moment(targetDate).startOf("day");

    const userAvailablePeriods = availabilityData
      .map((user) =>
        this.getUserAvailablePeriods(user, targetDayOfWeek, targetDateStart)
      )
      .filter(Boolean);

    if (!userAvailablePeriods) {
      return [];
    }
    let availableSlots: string[] = [];

    if (availabilityModel === AVAILABILITY_MODE_ALL) {
      // Find the available slots for all users
      // First find the available time period for all users, then divide it by number of mins

      const commonPeriods =
        this.findCommonAvailablePeriods(userAvailablePeriods);
      console.log(JSON.stringify(commonPeriods));
      availableSlots = this.dividePeriodsByMinutes(
        commonPeriods,
        periodMinutes,
        targetTimezone
      );
    } else if (availabilityModel === AVAILABILITY_MODE_ANY) {
      // Find the available slots for any users
      // Divide the avarible period by number of mins per user, then merge all slots and remove the duplications

      const allSlots = userAvailablePeriods
        .map((userPeriod) => {
          return this.dividePeriodsByMinutes(
            userPeriod.availablePeriods,
            periodMinutes,
            targetTimezone
          );
        })
        .flat();

      availableSlots = [...new Set(allSlots)];
      availableSlots.sort();
    }

    return availableSlots;
  }

  getUserAvailablePeriods(
    user: AvailabilityInput,
    targetDayOfWeek: number,
    targetDateStart: Moment
  ): {
    userId: number;
    availablePeriods: { start: Moment; end: Moment }[];
  } {
    const { userId, availability } = user;
    const { busy, workingHours } = availability;
    const timezone = "UTC";

    const workingHour = workingHours.days.includes(targetDayOfWeek)
      ? workingHours
      : null;

    if (!workingHour) {
      return { userId, availablePeriods: [] };
    }

    const workingStart = targetDateStart
      .clone()
      .add(workingHour.startTime, "minutes")
      .tz(timezone, true);
    const workingEnd = targetDateStart
      .clone()
      .add(workingHour.endTime, "minutes")
      .tz(timezone, true);

    const availablePeriods = [{ start: workingStart, end: workingEnd }];

    // Exclude busy periods
    for (const busyPeriod of busy) {
      const busyStart = moment.tz(busyPeriod.start, timezone);
      const busyEnd = moment.tz(busyPeriod.end, timezone);

      let i = 0;
      while (i < availablePeriods.length) {
        const { start, end } = availablePeriods[i];

        if (busyEnd.isBefore(start) || busyStart.isAfter(end)) {
          i++;
          continue;
        }

        availablePeriods.splice(i, 1);

        if (busyStart.isAfter(start)) {
          availablePeriods.push({ start, end: busyStart });
        }

        if (busyEnd.isBefore(end)) {
          availablePeriods.push({ start: busyEnd, end });
        }

        i++;
      }
    }

    // Sort periods by start time
    // which makes the merge later easily
    availablePeriods.sort((a, b) => a.start.diff(b.start));

    return { userId, availablePeriods };
  }

  findCommonAvailablePeriods(
    usersAvailability: {
      userId: number;
      availablePeriods: { start: any; end: any }[];
    }[]
  ) {
    let commonPeriods = usersAvailability[0].availablePeriods;

    for (let i = 1; i < usersAvailability.length; i++) {
      const currentUserPeriods = usersAvailability[i].availablePeriods;
      const newCommonPeriods = [];

      let j = 0;
      let k = 0;

      while (j < commonPeriods.length && k < currentUserPeriods.length) {
        const commonPeriod = commonPeriods[j];
        const userPeriod = currentUserPeriods[k];

        const latestStart = moment.max(commonPeriod.start, userPeriod.start);
        const earliestEnd = moment.min(commonPeriod.end, userPeriod.end);

        if (latestStart.isBefore(earliestEnd)) {
          newCommonPeriods.push({
            start: latestStart,
            end: earliestEnd,
          });
        }

        if (moment(commonPeriod.end).isBefore(moment(userPeriod.end))) {
          j++;
        } else {
          k++;
        }
      }

      commonPeriods = newCommonPeriods;

      if (commonPeriods.length === 0) {
        return [];
      }
    }

    return commonPeriods;
  }

  dividePeriodsByMinutes(
    periods: { start: Moment; end: Moment }[],
    numOfMinutes: number,
    timezone: string
  ) {
    const resultPeriods = [];

    for (const period of periods) {
      let currentTime = period.start.tz("UTC").clone().tz(timezone);
      const endTime = period.end.clone().tz(timezone);

      while (currentTime.isBefore(endTime)) {
        const nextTime = currentTime.clone().add(numOfMinutes, "minutes");

        if (nextTime.isAfter(endTime)) {
          break;
        }

        resultPeriods.push(currentTime.clone().toISOString(true));
        currentTime = nextTime;
      }
    }

    return resultPeriods;
  }
}
