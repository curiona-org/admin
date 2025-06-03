import { handleCurionaError } from "@/lib/error";
import { AdminService } from "@/lib/services/admin.service";
import { Filters } from "@/lib/services/api.service";

const adminService = new AdminService();

export async function getUser(id: number, filters: Filters) {
  try {
    const result = await adminService.getUser(id, filters);
    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}
