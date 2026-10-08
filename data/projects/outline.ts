import data from "./outline.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
