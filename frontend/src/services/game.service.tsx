import axios from "axios";
import { Game } from "../utils/types";

const API_ENDPOINT = import.meta.env.VITE_SERVER_URL;

console.log(API_ENDPOINT);

export default class GameService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createGame(userId: string, userName: string): Promise<Game | null> {
    try {
      const res = await this.axiosInstance.post<{ success: 1; data: Game }>(
        "/game",
        { userId, userName }
      );

      const { data } = res;
      if (data?.success === 1) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async joinGame(
    gameId: string,
    userId: string,
    userName: string,
    playerIndex: number
  ): Promise<Game | null> {
    try {
      const res = await this.axiosInstance.put<{ success: 1; data: Game }>(
        `/game/${gameId}`,
        { userId, userName, playerIndex }
      );

      const { data } = res;
      if (data?.success === 1) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async listGames(): Promise<Game[]> {
    try {
      const res = await this.axiosInstance.get<{ success: 1; data: Game[] }>(
        "/game"
      );

      const { data } = res;
      if (data?.success === 1) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }

    return [];
  }

  async exitGame(gameId: string, userId: string): Promise<boolean> {
    try {
      const res = await this.axiosInstance.post<{ success: 1 }>(
        `/game/${gameId}/exit`,
        { userId }
      );

      const { data } = res;
      return data?.success === 1;
    } catch (error) {
      console.log(error);
    }

    return false;
  }
}
