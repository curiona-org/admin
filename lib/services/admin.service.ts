import {
  apiClient,
  Filters,
  filtersToQueryString,
} from "@/lib/services/api.service";
import {
  GetStatisticsOutput,
  GetUserOutput,
  ListRoadmapsOutput,
  ListUsersOutput,
} from "@/types/api-admin";

export class AdminService {
  async statistics() {
    return apiClient
      .get<GetStatisticsOutput>("/admin/statistics")
      .then((res) => res?.data);
  }

  async listUsers(params: Filters) {
    const queryParams = filtersToQueryString(params);

    return apiClient
      .get<ListUsersOutput>(`/admin/users?${queryParams}`)
      .then((res) => res?.data);
  }

  async getUser(id: number, params: Filters) {
    const queryParams = filtersToQueryString(params);

    return apiClient
      .get<GetUserOutput>(`/admin/users/${id}?${queryParams}`)
      .then((res) => res?.data);
  }

  async deleteUser(id: number) {
    return apiClient.delete(`/admin/users/${id}`).then((res) => res?.data);
  }

  async suspendUser(id: number) {
    return apiClient
      .patch(`/admin/users/${id}/suspend`)
      .then((res) => res?.data);
  }

  async unsuspendUser(id: number) {
    return apiClient
      .patch(`/admin/users/${id}/unsuspend`)
      .then((res) => res?.data);
  }

  async listRoadmaps(params: Filters) {
    const queryParams = filtersToQueryString(params);

    return apiClient
      .get<ListRoadmapsOutput>(`/admin/roadmaps?${queryParams}`)
      .then((res) => res?.data);
  }

  async getRoadmap(id: number) {
    return apiClient.get(`/admin/roadmaps/${id}`).then((res) => res?.data);
  }

  async deleteRoadmap(id: number) {
    return apiClient.delete(`/admin/roadmaps/${id}`).then((res) => res?.data);
  }
}
