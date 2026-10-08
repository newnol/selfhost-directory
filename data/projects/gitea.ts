import data from "./gitea.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
