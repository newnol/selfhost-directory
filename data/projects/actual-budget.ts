import data from "./actual-budget.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
