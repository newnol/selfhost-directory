import data from "./metabase.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
