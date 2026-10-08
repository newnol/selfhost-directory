import data from "./immich.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
