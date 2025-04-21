import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "./border-beam";

interface BeamCardProps {
  className?: string;
  wrapperClassName?: string;
  beamSize?: number;
  duration?: number;
  delay?: number;
}

export const BeamCard: FC<PropsWithChildren<BeamCardProps>> = ({
  children,
  className,
  wrapperClassName,
  beamSize = 100,
  duration = 12,
  delay = 9,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg p-5 shadow-lg bg-white",
        wrapperClassName
      )}
      {...props}
    >
      <div className={cn("flex flex-col", className)}>{children}</div>
      <BorderBeam
        // borderWidth={2}
        size={beamSize}
        duration={duration}
        delay={delay}
      />
    </div>
  );
};
