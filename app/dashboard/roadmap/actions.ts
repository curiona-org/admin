import { handleCurionaError } from "@/lib/error";
import { AdminService } from "@/lib/services/admin.service";
import { Filters } from "@/lib/services/api.service";

const adminService = new AdminService();

export async function listRoadmaps(filters: Filters) {
  try {
    const result = await adminService.listRoadmaps(filters);
    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}

export async function deleteRoadmap(id: number) {
  try {
    const result = await adminService.deleteRoadmap(id);
    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}
