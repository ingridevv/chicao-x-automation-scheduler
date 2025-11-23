import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { insertAusenciaSchema, type InsertAusencia, type Professor, type Disciplina, type Turma } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DIAS_SEMANA = [
  { value: 0, label: "Segunda-feira" },
  { value: 1, label: "Terça-feira" },
  { value: 2, label: "Quarta-feira" },
  { value: 3, label: "Quinta-feira" },
  { value: 4, label: "Sexta-feira" },
];

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default function Substituicao() {
  const { toast } = useToast();
  const today = new Date();

  const { data: professores = [] } = useQuery<Professor[]>({
    queryKey: ["/api/professores"],
  });

  const { data: disciplinas = [] } = useQuery<Disciplina[]>({
    queryKey: ["/api/disciplinas"],
  });

  const { data: turmas = [] } = useQuery<Turma[]>({
    queryKey: ["/api/turmas"],
  });

  const form = useForm<InsertAusencia>({
    resolver: zodResolver(insertAusenciaSchema),
    defaultValues: {
      professorId: "",
      disciplinaId: "",
      turmaId: "",
      diaSemana: 0,
      horarioInicio: "07:00",
      duracao: 1,
      semana: getWeekNumber(today),
      ano: today.getFullYear(),
    },
  });

  const createAusenciaMutation = useMutation({
    mutationFn: (data: InsertAusencia) => apiRequest("POST", "/api/ausencias", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ausencias"] });
      queryClient.invalidateQueries({ queryKey: ["/api/escala-semanal"] });
      toast({
        title: "Ausência registrada",
        description: "Ausência cadastrada com sucesso. Use 'Gerar Automaticamente' para escalar substituto.",
      });
      form.reset({
        professorId: "",
        disciplinaId: "",
        turmaId: "",
        diaSemana: 0,
        horarioInicio: "07:00",
        duracao: 1,
        semana: getWeekNumber(today),
        ano: today.getFullYear(),
      });
    },
  });

  const onSubmit = (data: InsertAusencia) => {
    createAusenciaMutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Registrar Substituição</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cadastre ausências de professores para gerar escala automática
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Nova Ausência</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="professorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professor Ausente</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-professor">
                            <SelectValue placeholder="Selecione o professor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {professores.map((professor) => (
                            <SelectItem key={professor.id} value={professor.id}>
                              {professor.nome} ({professor.areaConhecimento})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disciplinaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disciplina</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-disciplina">
                            <SelectValue placeholder="Selecione a disciplina" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {disciplinas.map((disciplina) => (
                            <SelectItem key={disciplina.id} value={disciplina.id}>
                              {disciplina.nome} ({disciplina.areaConhecimento})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="turmaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turma</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-turma">
                            <SelectValue placeholder="Selecione a turma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {turmas.map((turma) => (
                            <SelectItem key={turma.id} value={turma.id}>
                              {turma.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="diaSemana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dia da Semana</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-dia-semana">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DIAS_SEMANA.map((dia) => (
                              <SelectItem key={dia.value} value={dia.value.toString()}>
                                {dia.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="horarioInicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} data-testid="input-horario" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="duracao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (horas)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={8}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-duracao"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="semana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semana</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={53}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-semana"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ano"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={2024}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-ano"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createAusenciaMutation.isPending}
                  data-testid="button-registrar-ausencia"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Ausência
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Como Funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Registre a Ausência</h3>
              <p className="text-sm text-muted-foreground">
                Preencha os dados do professor ausente, disciplina, turma, horário e duração da aula.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">2. Algoritmo de Substituição</h3>
              <p className="text-sm text-muted-foreground">
                O sistema filtra professores da mesma área de conhecimento, verifica carga horária
                (máximo 60h) e seleciona automaticamente o professor com menor carga.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">3. Gere a Escala</h3>
              <p className="text-sm text-muted-foreground">
                Na página "Escala Semanal", clique em "Gerar Automaticamente" para processar
                todas as ausências pendentes e atribuir substitutos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
