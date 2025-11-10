import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
}

export default function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  badgeColor = "bg-[#1E88E5]",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`p-3 ${badgeColor} rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-['Poppins',sans-serif]">
              {title}
            </h2>
            {badge && (
              <span className={`px-3 py-1 ${badgeColor} text-white text-sm font-semibold rounded-full font-['Nunito',sans-serif]`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-lg text-gray-600 mt-2 font-['Nunito',sans-serif]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

