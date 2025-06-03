import config from "@/lib/config";
import { APIService } from "@/lib/services/api.service";

export class RoadmapService extends APIService {
  constructor() {
    super(config.BACKEND_URL);
  }
}
