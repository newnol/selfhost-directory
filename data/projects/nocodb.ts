import data from "./nocodb.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
