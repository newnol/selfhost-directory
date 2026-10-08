import data from "./jellyfin.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
