import data from "./vikunja.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
