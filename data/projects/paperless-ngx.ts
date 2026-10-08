import data from "./paperless-ngx.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
