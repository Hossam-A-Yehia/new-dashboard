import { ContainerProps } from "@/types/Atoms";

export default function Container({
  children,
  additionalClasses = "",
}: ContainerProps) {
  return (
    <div className={`container mx-auto ${additionalClasses}`.trim()}>
      {children}
    </div>
  );
}
