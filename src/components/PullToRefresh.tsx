import { ReactNode, forwardRef } from "react";
import { Loader2, ArrowDown } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
  disabled?: boolean;
}

export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(
  ({ children, onRefresh, className, disabled = false }, ref) => {
    const { isRefreshing, pullDistance, isPulling, containerRef } = usePullToRefresh({
      onRefresh,
      threshold: 80,
      disabled,
    });

    const progress = Math.min(pullDistance / 80, 1);
    const showIndicator = pullDistance > 10 || isRefreshing;

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-auto", className)}
      >
        {/* Pull indicator */}
        <div
          className={cn(
            "absolute left-0 right-0 flex justify-center items-center transition-all duration-200 z-10",
            showIndicator ? "opacity-100" : "opacity-0"
          )}
          style={{
            top: 0,
            height: `${Math.max(pullDistance, isRefreshing ? 50 : 0)}px`,
            transform: `translateY(${pullDistance > 0 ? 0 : -50}px)`,
          }}
        >
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full bg-background border shadow-md transition-transform",
              isRefreshing && "animate-pulse"
            )}
            style={{
              transform: `rotate(${progress * 180}deg) scale(${0.5 + progress * 0.5})`,
            }}
          >
            {isRefreshing ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <ArrowDown 
                className={cn(
                  "h-5 w-5 transition-colors",
                  progress >= 1 ? "text-primary" : "text-muted-foreground"
                )}
              />
            )}
          </div>
        </div>

        {/* Content with pull transform */}
        <div
          style={{
            transform: `translateY(${pullDistance}px)`,
            transition: isPulling ? "none" : "transform 0.2s ease-out",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

PullToRefresh.displayName = "PullToRefresh";
