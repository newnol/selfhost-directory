import data from "./authentik.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
