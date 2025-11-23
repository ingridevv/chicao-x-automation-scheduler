import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { insertProfessorSchema, type Professor, type InsertProfessor } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Professores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const { toast } = useToast();

  const { data: professores = [], isLoading } = useQuery<Professor[]>({
    queryKey: ["/api/professores"],
  });

  const form = useForm<InsertProfessor>({
    resolver: zodResolver(insertProfessorSchema),
    defaultValues: {
      nome: "",
      areaConhecimento: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertProfessor) => apiRequest("POST", "/api/professores", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/professores"] });
      toast({
        title: "Professor cadastrado",
        description: "Professor adicionado com sucesso.",
      });
      setDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertProfessor }) =>
      apiRequest("PATCH", `/api/professores/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/professores"] });
      toast({
        title: "Professor atualizado",
        description: "Dados atualizados com sucesso.",
      });
      setDialogOpen(false);
      setEditingProfessor(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/professores/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/professores"] });
      toast({
        title: "Professor removido",
        description: "Professor excluído com sucesso.",
      });
    },
  });

  const handleOpenDialog = (professor?: Professor) => {
    if (professor) {
      setEditingProfessor(professor);
      form.reset({
        nome: professor.nome,
        areaConhecimento: professor.areaConhecimento,
      });
    } else {
      setEditingProfessor(null);
      form.reset({ nome: "", areaConhecimento: "" });
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: InsertProfessor) => {
    if (editingProfessor) {
      updateMutation.mutate({ id: editingProfessor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredProfessores = professores.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.areaConhecimento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Professores</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o cadastro de professores e carga horária
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-professor">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Professor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar professores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-professores"
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
                <TableHead>Carga Horária</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredProfessores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum professor encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfessores.map((professor) => (
                  <TableRow key={professor.id} data-testid={`row-professor-${professor.id}`}>
                    <TableCell className="font-medium">{professor.nome}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{professor.areaConhecimento}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={(professor.cargaHoraria / 60) * 100} className="w-24" />
                        <span className="text-sm text-muted-foreground" data-testid={`text-carga-${professor.id}`}>
                          {professor.cargaHoraria}h / 60h
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(professor)}
                          data-testid={`button-edit-${professor.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(professor.id)}
                          data-testid={`button-delete-${professor.id}`}
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
              {editingProfessor ? "Editar Professor" : "Novo Professor"}
            </DialogTitle>
            <DialogDescription>
              {editingProfessor
                ? "Atualize as informações do professor"
                : "Preencha os dados do novo professor"}
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
                      <Input placeholder="Nome completo" {...field} data-testid="input-nome" />
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
                      <Input placeholder="Ex: Matemática, História..." {...field} data-testid="input-area" />
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
                  {editingProfessor ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
