import { apiClient } from "@/lib/services/api.service";
import { GetProfileOutput } from "@/types/api-profile";

export class ProfileService {
  async profile() {
    return apiClient.get<GetProfileOutput>("/profile").then((res) => res?.data);
  }
}
