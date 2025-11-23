import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  loading?: boolean;
  testId?: string;
}

export function MetricsCard({ title, value, icon: Icon, loading, testId }: MetricsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-10 w-20" />
        ) : (
          <div className="text-4xl font-bold" data-testid={testId}>
            {value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
