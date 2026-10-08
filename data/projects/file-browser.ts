import data from "./file-browser.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
