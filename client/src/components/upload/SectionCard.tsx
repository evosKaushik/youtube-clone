import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

const SectionCard = ({ title, description, children }: Props) => {
  return (
    <div className="bg-card border border-border rounded-3xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>

        {description && (
          <p className="text-sm text-secondaryText mt-1">{description}</p>
        )}
      </div>

      {children}
    </div>
  );
};

export default SectionCard