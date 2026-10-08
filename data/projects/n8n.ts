import data from "./n8n.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
