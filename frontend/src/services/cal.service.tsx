import axios from 'axios';
import { getFirstAndLastDayOfMonth, getToday } from '../utils/helper';

export default class CalSerice {

    private axiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:3003/v1',
            headers: {
              'Content-Type': 'application/json',
            },
        });
    }

    async fetchSlots(date?: string): Promise<{time: string}[]> {
        const target = date ?? getToday();
        const {firstDay, lastDay} = getFirstAndLastDayOfMonth(target);
        try {
            const params = {
                usernameList: "ca-tx",
                eventTypeSlug: "15-new-patient",
                startTime: firstDay,
                endTime: lastDay,
                timeZone: "America/Los_Angeles",
                apiKey: "cal_4fec7a7306b78dd1b3bfb3ad40d2d367"
            }
            const res = await this.axiosInstance.get('/slots', { params });

            const { data } = res;
            return data.slots[target] || [];
        }
        catch(error) {
            console.log(error);
        }

        return [];
    }
}