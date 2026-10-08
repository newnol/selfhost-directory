import data from "./plane.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
