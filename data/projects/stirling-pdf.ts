import data from "./stirling-pdf.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
