import data from "./langfuse.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
