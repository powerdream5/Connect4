import axios from 'axios';
import { Game } from '../utils/types';

export default class GameSerice {

    private axiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:3000',
            headers: {
              'Content-Type': 'application/json',
            },
        });
    }

    async createGame(userId: string, userName: string): Promise<Game | null> {
        try {
            const res = await this.axiosInstance.post<{success: 1, data: Game}>('/game', {userId, userName});

            const { data } = res;
            if(data?.success === 1) {
                return data.data;
            }
        }
        catch(error) {
            console.log(error);
        }

        return null;
    }
}