import data from "./uptime-kuma.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
