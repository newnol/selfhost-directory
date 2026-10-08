import data from "./memos.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
