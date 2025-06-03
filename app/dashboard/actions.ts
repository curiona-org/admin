import { handleCurionaError } from "@/lib/error";
import { AdminService } from "@/lib/services/admin.service";
import { Filters } from "@/lib/services/api.service";

const adminService = new AdminService();

export async function getStatistics() {
  try {
    const result = await adminService.statistics();
    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}

export async function listUsers(filters: Filters) {
  try {
    const result = await adminService.listUsers(filters);
    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}

export async function suspendUser(id: number) {
  try {
    const result = await adminService.suspendUser(id);
    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}

export async function unsuspendUser(id: number) {
  try {
    const result = await adminService.unsuspendUser(id);
    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}

export async function deleteUser(id: number) {
  try {
    const result = await adminService.deleteUser(id);
    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}
