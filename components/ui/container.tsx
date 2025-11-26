import { cn } from "@/lib/utils";
interface Props {
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mx-[var(--margin-mobile)] sm:mx-[var(--margin-desktop)] w-[calc(100%_-_var(--margin-mobile)*2)] sm:w-[calc(100%_-_var(--margin-desktop)*2)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
