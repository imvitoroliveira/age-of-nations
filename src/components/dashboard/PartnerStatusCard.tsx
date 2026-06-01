import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface PartnerStatusCardProps {
  name: string;
  trainedToday: boolean;
}

export function PartnerStatusCard({ name, trainedToday }: PartnerStatusCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-white p-6 shadow-lg"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-bg p-2 text-primary">
          <Users size={20} />
        </span>
        <span className="text-xs font-bold text-text-muted uppercase">Status do Parceiro</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent">
          <span className="text-xl font-bold text-accent">{name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold">{name}</h3>
          <p className={`text-sm font-medium ${trainedToday ? "text-green-500" : "text-text-muted"}`}>
            {trainedToday ? "Treinou hoje! ✅" : "Ainda não treinou"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
