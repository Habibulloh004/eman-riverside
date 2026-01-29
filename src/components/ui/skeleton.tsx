import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Card skeleton for estates/catalog
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

// Floor plan skeleton
export function FloorPlanSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div className="relative">
        <Skeleton className="aspect-4/3 rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
    </div>
  );
}

// Gallery image skeleton
export function GallerySkeleton() {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <Skeleton className="aspect-4/3 w-full" />
    </div>
  );
}

// Feature section skeleton
export function FeatureSkeleton() {
  return (
    <div className="py-24 lg:py-32 bg-[#F9EFE7]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="space-y-6">
            <Skeleton className="h-32 w-32 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-20 w-full max-w-md" />
            </div>
          </div>
          <Skeleton className="aspect-4/3 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Grid skeleton
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
