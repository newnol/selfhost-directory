import data from "./ollama.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
