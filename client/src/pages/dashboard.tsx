import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { MetricsCard } from "@/components/metrics-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";

interface DashboardStats {
  totalSubstituicoes: number;
  substituicoesAtribuidas: number;
  semDisponibilidade: number;
  pendentes: number;
  professoresMaisEscalados: Array<{
    nome: string;
    total: number;
  }>;
  substituicoesTimeline: Array<{
    semana: string;
    total: number;
  }>;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe as métricas e estatísticas do sistema de substituição
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <MetricsCard
          title="Substituições Criadas"
          value={stats?.substituicoesAtribuidas || 0}
          icon={CheckCircle2}
          loading={isLoading}
          testId="metric-substituicoes-criadas"
        />
        <MetricsCard
          title="Necessidades Pendentes"
          value={stats?.pendentes || 0}
          icon={Clock}
          loading={isLoading}
          testId="metric-necessidades-pendentes"
        />
        <MetricsCard
          title="Sem Disponibilidade"
          value={stats?.semDisponibilidade || 0}
          icon={AlertCircle}
          loading={isLoading}
          testId="metric-sem-disponibilidade"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Substituições ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={stats?.substituicoesTimeline || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="semana" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))" }}
                    name="Substituições"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Professores Mais Escalados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stats?.professoresMaisEscalados || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="nome" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="total" 
                    fill="hsl(var(--chart-2))" 
                    radius={[4, 4, 0, 0]}
                    name="Total de Escalas"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
