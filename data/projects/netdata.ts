import data from "./netdata.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
