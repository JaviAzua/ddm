import { works } from "@/app/data/data";
import { TrabajosManager } from "./trabajos-manager";

export default function AdminTrabajosPage() {
  return <TrabajosManager initialWorks={works} />;
}
