import { useState, Fragment } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Ausencia, Substituicao, Professor, Disciplina, Turma } from "@shared/schema";

interface AusenciaCompleta extends Ausencia {
  professor: Professor;
  disciplina: Disciplina;
  turma: Turma;
  substituicao?: Substituicao & { professorSubstituto?: Professor };
}

interface EscalaSemanalData {
  semana: number;
  ano: number;
  ausencias: AusenciaCompleta[];
}

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const HORARIOS = ["07:00", "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default function EscalaSemanal() {
  const today = new Date();
  const [semanaAtual, setSemanaAtual] = useState(getWeekNumber(today));
  const [anoAtual] = useState(today.getFullYear());
  const { toast } = useToast();

  const { data: escala, isLoading } = useQuery<EscalaSemanalData>({
    queryKey: ["/api/escala-semanal", semanaAtual, anoAtual],
  });

  const gerarEscalaMutation = useMutation<{ geradas: number; falhas: number }>({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/gerar-escala", { semana: semanaAtual, ano: anoAtual });
      return res.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/escala-semanal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Escala gerada",
        description: `${result.geradas} substituições criadas, ${result.falhas} necessidades sem disponibilidade.`,
      });
    },
  });

  const getAusenciaParaHorarioDia = (dia: number, horario: string) => {
    return escala?.ausencias.find(
      (a) => a.diaSemana === dia && a.horarioInicio === horario
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Escala Semanal de Substituições
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualização e gerenciamento da escala semanal de professores substitutos
          </p>
        </div>
        <Button
          onClick={() => gerarEscalaMutation.mutate()}
          disabled={gerarEscalaMutation.isPending}
          data-testid="button-gerar-escala"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Gerar Automaticamente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Semana Atual ({semanaAtual}-{anoAtual})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSemanaAtual((s) => Math.max(1, s - 1))}
                data-testid="button-prev-week"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSemanaAtual((s) => Math.min(53, s + 1))}
                data-testid="button-next-week"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Carregando grade...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="grid grid-cols-6 gap-2">
                  {/* Header */}
                  <div className="font-medium text-sm text-muted-foreground p-4 border-b">
                    Horário
                  </div>
                  {DIAS_SEMANA.map((dia, index) => (
                    <div
                      key={dia}
                      className="font-medium text-sm text-center p-4 border-b"
                      data-testid={`header-day-${index}`}
                    >
                      {dia}
                    </div>
                  ))}

                  {/* Grid */}
                  {HORARIOS.map((horario) => (
                    <Fragment key={`row-${horario}`}>
                      <div
                        className="font-medium text-sm text-muted-foreground p-4 border-r"
                      >
                        {horario}
                      </div>
                      {DIAS_SEMANA.map((_, diaIndex) => {
                        const ausencia = getAusenciaParaHorarioDia(diaIndex, horario);
                        const isSubstituida = ausencia?.substituicao?.status === "atribuida";
                        const isSemDisponibilidade =
                          ausencia?.substituicao?.status === "sem_disponibilidade";

                        return (
                          <div
                            key={`${horario}-${diaIndex}`}
                            className={`min-h-20 p-3 border rounded-md ${
                              ausencia
                                ? isSubstituida
                                  ? "bg-accent/10 border-accent"
                                  : isSemDisponibilidade
                                  ? "bg-destructive/10 border-destructive"
                                  : "bg-muted/30 border-muted"
                                : "border-dashed"
                            }`}
                            data-testid={`cell-${diaIndex}-${horario}`}
                          >
                            {ausencia && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  {ausencia.disciplina.nome}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {ausencia.professor.nome}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Turma: {ausencia.turma.nome}
                                </p>
                                {isSubstituida && ausencia.substituicao?.professorSubstituto && (
                                  <Badge variant="default" className="text-xs mt-1">
                                    Substituto: {ausencia.substituicao.professorSubstituto.nome}
                                  </Badge>
                                )}
                                {isSemDisponibilidade && (
                                  <Badge variant="destructive" className="text-xs mt-1">
                                    Sem disponibilidade
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </Fragment>
                  ))}
                </div>
              </div>

              {escala && escala.ausencias.length > 0 && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium mb-2">Geração concluída:</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      <strong>{escala.ausencias.filter((a) => a.substituicao?.status === "atribuida").length}</strong>{" "}
                      substituições criadas
                    </span>
                    <span>
                      <strong>{escala.ausencias.filter((a) => a.substituicao?.status === "pendente").length}</strong>{" "}
                      necessidades pendentes
                    </span>
                    <span>
                      <strong>{escala.ausencias.filter((a) => a.substituicao?.status === "sem_disponibilidade").length}</strong>{" "}
                      sem disponibilidade
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
