import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { insertTurmaSchema, type Turma, type InsertTurma } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Turmas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const { toast } = useToast();

  const { data: turmas = [], isLoading } = useQuery<Turma[]>({
    queryKey: ["/api/turmas"],
  });

  const form = useForm<InsertTurma>({
    resolver: zodResolver(insertTurmaSchema),
    defaultValues: {
      nome: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertTurma) => apiRequest("POST", "/api/turmas", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/turmas"] });
      toast({
        title: "Turma cadastrada",
        description: "Turma adicionada com sucesso.",
      });
      setDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertTurma }) =>
      apiRequest("PATCH", `/api/turmas/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/turmas"] });
      toast({
        title: "Turma atualizada",
        description: "Dados atualizados com sucesso.",
      });
      setDialogOpen(false);
      setEditingTurma(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/turmas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/turmas"] });
      toast({
        title: "Turma removida",
        description: "Turma excluída com sucesso.",
      });
    },
  });

  const handleOpenDialog = (turma?: Turma) => {
    if (turma) {
      setEditingTurma(turma);
      form.reset({ nome: turma.nome });
    } else {
      setEditingTurma(null);
      form.reset({ nome: "" });
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: InsertTurma) => {
    if (editingTurma) {
      updateMutation.mutate({ id: editingTurma.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Turmas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o cadastro de turmas
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-turma">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Turma
        </Button>
      </div>

      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : turmas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Nenhuma turma cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                turmas.map((turma) => (
                  <TableRow key={turma.id} data-testid={`row-turma-${turma.id}`}>
                    <TableCell className="font-medium">{turma.nome}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(turma)}
                          data-testid={`button-edit-${turma.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(turma.id)}
                          data-testid={`button-delete-${turma.id}`}
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
              {editingTurma ? "Editar Turma" : "Nova Turma"}
            </DialogTitle>
            <DialogDescription>
              {editingTurma
                ? "Atualize as informações da turma"
                : "Preencha os dados da nova turma"}
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
                      <Input placeholder="Ex: 1º Ano A, 9º B..." {...field} data-testid="input-nome" />
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
                  {editingTurma ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
