import { Fish } from "lucide-react";
export default function EmptyState({
  title,
  description,
  action,
  onAction,
  icon: Icon = Fish,
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={30} strokeWidth={1.5} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button className="button primary" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
