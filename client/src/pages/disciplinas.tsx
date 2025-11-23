import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDisciplinaSchema, type Disciplina, type InsertDisciplina } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Disciplinas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const { toast } = useToast();

  const { data: disciplinas = [], isLoading } = useQuery<Disciplina[]>({
    queryKey: ["/api/disciplinas"],
  });

  const form = useForm<InsertDisciplina>({
    resolver: zodResolver(insertDisciplinaSchema),
    defaultValues: {
      nome: "",
      areaConhecimento: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertDisciplina) => apiRequest("POST", "/api/disciplinas", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disciplinas"] });
      toast({
        title: "Disciplina cadastrada",
        description: "Disciplina adicionada com sucesso.",
      });
      setDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertDisciplina }) =>
      apiRequest("PATCH", `/api/disciplinas/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disciplinas"] });
      toast({
        title: "Disciplina atualizada",
        description: "Dados atualizados com sucesso.",
      });
      setDialogOpen(false);
      setEditingDisciplina(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/disciplinas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disciplinas"] });
      toast({
        title: "Disciplina removida",
        description: "Disciplina excluída com sucesso.",
      });
    },
  });

  const handleOpenDialog = (disciplina?: Disciplina) => {
    if (disciplina) {
      setEditingDisciplina(disciplina);
      form.reset({
        nome: disciplina.nome,
        areaConhecimento: disciplina.areaConhecimento,
      });
    } else {
      setEditingDisciplina(null);
      form.reset({ nome: "", areaConhecimento: "" });
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: InsertDisciplina) => {
    if (editingDisciplina) {
      updateMutation.mutate({ id: editingDisciplina.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredDisciplinas = disciplinas.filter((d) =>
    d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.areaConhecimento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Disciplinas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o cadastro de disciplinas e áreas de conhecimento
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-disciplina">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Disciplina
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar disciplinas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-disciplinas"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Área de Conhecimento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredDisciplinas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhuma disciplina encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredDisciplinas.map((disciplina) => (
                  <TableRow key={disciplina.id} data-testid={`row-disciplina-${disciplina.id}`}>
                    <TableCell className="font-medium">{disciplina.nome}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{disciplina.areaConhecimento}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(disciplina)}
                          data-testid={`button-edit-${disciplina.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(disciplina.id)}
                          data-testid={`button-delete-${disciplina.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDisciplina ? "Editar Disciplina" : "Nova Disciplina"}
            </DialogTitle>
            <DialogDescription>
              {editingDisciplina
                ? "Atualize as informações da disciplina"
                : "Preencha os dados da nova disciplina"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Matemática I, História..." {...field} data-testid="input-nome" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="areaConhecimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área de Conhecimento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Matemática, Ciências Humanas..." {...field} data-testid="input-area" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {editingDisciplina ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
