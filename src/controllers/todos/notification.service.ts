import axios from "axios";
import { config } from "../../configuration/config";

export function sendNotification(message: string): Promise<void> {
  return axios.post(`${config.http.servicesUrl}/notify/notifications`, {
    message,
  });
}
