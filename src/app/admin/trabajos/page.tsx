import { getWorksWithDetails } from "./actions";
import { TrabajosManager } from "./trabajos-manager";

export default async function AdminTrabajosPage() {
  const initialWorks = await getWorksWithDetails();
  return <TrabajosManager initialWorks={initialWorks} />;
}
