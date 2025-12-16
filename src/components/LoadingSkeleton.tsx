import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DocumentLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-6" />
        
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </Card>
    </div>
  );
}

export function EditorLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      <Card className="p-8 min-h-[500px]">
        <Skeleton className="h-8 w-2/3 mb-6" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-4/5 mb-6" />
        
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
      </Card>
    </div>
  );
}

export function FormLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <Skeleton className="h-8 w-1/2 mb-6" />
        
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <Skeleton className="h-12 w-32 mt-6" />
        </div>
      </Card>
    </div>
  );
}

export function GridLoadingSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
      ))}
    </div>
  );
}

export function ListLoadingSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4 animate-fade-in">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="p-4 flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </Card>
      ))}
    </div>
  );
}
