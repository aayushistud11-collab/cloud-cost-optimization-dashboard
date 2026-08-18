interface BadgeProps {
  label: string;
  variant?: "green" | "amber" | "red" | "blue" | "cyan" | "gray" | "purple";
}

const map = {
  green: "bg-green-400/10 text-green-400 border-green-400/20",
  amber: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  red: "bg-red-400/10 text-red-400 border-red-400/20",
  blue: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  cyan: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  gray: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  purple: "bg-purple-400/10 text-purple-400 border-purple-400/20",
};

export default function Badge({ label, variant = "gray" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border font-mono ${map[variant]}`}>
      {label}
    </span>
  );
}
