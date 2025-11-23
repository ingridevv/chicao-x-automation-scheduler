import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertProfessorSchema,
  insertDisciplinaSchema,
  insertTurmaSchema,
  insertAusenciaSchema,
  type Professor,
  type Disciplina,
  type Turma,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Professores
  app.get("/api/professores", async (_req, res) => {
    const professores = await storage.getAllProfessores();
    res.json(professores);
  });

  app.post("/api/professores", async (req, res) => {
    try {
      const data = insertProfessorSchema.parse(req.body);
      const professor = await storage.createProfessor(data);
      res.json(professor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/professores/:id", async (req, res) => {
    try {
      const data = insertProfessorSchema.partial().parse(req.body);
      const professor = await storage.updateProfessor(req.params.id, data);
      if (!professor) {
        return res.status(404).json({ error: "Professor não encontrado" });
      }
      res.json(professor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/professores/:id", async (req, res) => {
    const deleted = await storage.deleteProfessor(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }
    res.json({ success: true });
  });

  // Disciplinas
  app.get("/api/disciplinas", async (_req, res) => {
    const disciplinas = await storage.getAllDisciplinas();
    res.json(disciplinas);
  });

  app.post("/api/disciplinas", async (req, res) => {
    try {
      const data = insertDisciplinaSchema.parse(req.body);
      const disciplina = await storage.createDisciplina(data);
      res.json(disciplina);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/disciplinas/:id", async (req, res) => {
    try {
      const data = insertDisciplinaSchema.partial().parse(req.body);
      const disciplina = await storage.updateDisciplina(req.params.id, data);
      if (!disciplina) {
        return res.status(404).json({ error: "Disciplina não encontrada" });
      }
      res.json(disciplina);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/disciplinas/:id", async (req, res) => {
    const deleted = await storage.deleteDisciplina(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Disciplina não encontrada" });
    }
    res.json({ success: true });
  });

  // Turmas
  app.get("/api/turmas", async (_req, res) => {
    const turmas = await storage.getAllTurmas();
    res.json(turmas);
  });

  app.post("/api/turmas", async (req, res) => {
    try {
      const data = insertTurmaSchema.parse(req.body);
      const turma = await storage.createTurma(data);
      res.json(turma);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/turmas/:id", async (req, res) => {
    try {
      const data = insertTurmaSchema.partial().parse(req.body);
      const turma = await storage.updateTurma(req.params.id, data);
      if (!turma) {
        return res.status(404).json({ error: "Turma não encontrada" });
      }
      res.json(turma);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/turmas/:id", async (req, res) => {
    const deleted = await storage.deleteTurma(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Turma não encontrada" });
    }
    res.json({ success: true });
  });

  // Ausências
  app.get("/api/ausencias", async (_req, res) => {
    const ausencias = await storage.getAllAusencias();
    res.json(ausencias);
  });

  app.post("/api/ausencias", async (req, res) => {
    try {
      const data = insertAusenciaSchema.parse(req.body);
      const ausencia = await storage.createAusencia(data);
      res.json(ausencia);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/ausencias/:id", async (req, res) => {
    const deleted = await storage.deleteAusencia(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Ausência não encontrada" });
    }
    res.json({ success: true });
  });

  // Escala Semanal
  app.get("/api/escala-semanal", async (req, res) => {
    const semana = parseInt(req.query.semana as string);
    const ano = parseInt(req.query.ano as string);

    if (!semana || !ano) {
      return res.status(400).json({ error: "Semana e ano são obrigatórios" });
    }

    const ausencias = await storage.getAusenciasBySemana(semana, ano);
    const professores = await storage.getAllProfessores();
    const disciplinas = await storage.getAllDisciplinas();
    const turmas = await storage.getAllTurmas();
    const substituicoes = await storage.getAllSubstituicoes();

    const professoresMap = new Map(professores.map((p) => [p.id, p]));
    const disciplinasMap = new Map(disciplinas.map((d) => [d.id, d]));
    const turmasMap = new Map(turmas.map((t) => [t.id, t]));
    const substituicoesMap = new Map(substituicoes.map((s) => [s.ausenciaId, s]));

    const ausenciasCompletas = ausencias.map((ausencia) => ({
      ...ausencia,
      professor: professoresMap.get(ausencia.professorId)!,
      disciplina: disciplinasMap.get(ausencia.disciplinaId)!,
      turma: turmasMap.get(ausencia.turmaId)!,
      substituicao: substituicoesMap.get(ausencia.id)
        ? {
            ...substituicoesMap.get(ausencia.id)!,
            professorSubstituto: substituicoesMap.get(ausencia.id)!.professorSubstitutoId
              ? professoresMap.get(substituicoesMap.get(ausencia.id)!.professorSubstitutoId!)
              : undefined,
          }
        : undefined,
    }));

    res.json({
      semana,
      ano,
      ausencias: ausenciasCompletas,
    });
  });

  // Algoritmo de Geração de Escala
  app.post("/api/gerar-escala", async (req, res) => {
    const { semana, ano } = req.body;

    if (!semana || !ano) {
      return res.status(400).json({ error: "Semana e ano são obrigatórios" });
    }

    const ausencias = await storage.getAusenciasBySemana(semana, ano);
    const professores = await storage.getAllProfessores();
    const substituicoes = await storage.getAllSubstituicoes();

    let geradas = 0;
    let falhas = 0;

    for (const ausencia of ausencias) {
      const substituicao = substituicoes.find((s) => s.ausenciaId === ausencia.id);
      
      // Só processar substituições pendentes
      if (!substituicao || substituicao.status !== "pendente") {
        continue;
      }

      // Buscar professor ausente para obter área de conhecimento
      const professorAusente = professores.find((p) => p.id === ausencia.professorId);
      if (!professorAusente) {
        continue;
      }

      // Algoritmo de Substituição
      // 1. Filtrar por área de conhecimento
      let candidatos = professores.filter(
        (p) =>
          p.id !== ausencia.professorId &&
          p.areaConhecimento === professorAusente.areaConhecimento
      );

      // 2. Verificar carga horária (máximo 60h)
      candidatos = candidatos.filter((p) => p.cargaHoraria + ausencia.duracao <= 60);

      // 3. Selecionar professor com menor carga horária
      if (candidatos.length === 0) {
        // Sem disponibilidade
        await storage.updateSubstituicao(substituicao.id, {
          status: "sem_disponibilidade",
          mensagem: "Nenhum professor disponível com a área de conhecimento necessária e carga horária adequada",
        });
        falhas++;
      } else {
        // Ordenar por carga horária crescente
        candidatos.sort((a, b) => a.cargaHoraria - b.cargaHoraria);
        const substituto = candidatos[0];

        // Atribuir substituto
        await storage.updateSubstituicao(substituicao.id, {
          professorSubstitutoId: substituto.id,
          status: "atribuida",
          mensagem: `Professor ${substituto.nome} escalado automaticamente`,
        });

        // Atualizar carga horária do substituto
        await storage.updateCargaHoraria(
          substituto.id,
          substituto.cargaHoraria + ausencia.duracao
        );

        geradas++;
      }
    }

    res.json({ geradas, falhas });
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", async (_req, res) => {
    const substituicoes = await storage.getAllSubstituicoes();
    const professores = await storage.getAllProfessores();
    const ausencias = await storage.getAllAusencias();

    const totalSubstituicoes = substituicoes.length;
    const substituicoesAtribuidas = substituicoes.filter((s) => s.status === "atribuida").length;
    const semDisponibilidade = substituicoes.filter((s) => s.status === "sem_disponibilidade").length;
    const pendentes = substituicoes.filter((s) => s.status === "pendente").length;

    // Professores mais escalados
    const contagem = new Map<string, { nome: string; total: number }>();
    for (const sub of substituicoes) {
      if (sub.status === "atribuida" && sub.professorSubstitutoId) {
        const professor = professores.find((p) => p.id === sub.professorSubstitutoId);
        if (professor) {
          const atual = contagem.get(professor.id) || { nome: professor.nome, total: 0 };
          contagem.set(professor.id, { nome: professor.nome, total: atual.total + 1 });
        }
      }
    }

    const professoresMaisEscalados = Array.from(contagem.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Substituições ao longo do tempo (últimas 8 semanas)
    const semanasPorAusencia = new Map<string, number>();
    for (const ausencia of ausencias) {
      const key = `Sem ${ausencia.semana}`;
      semanasPorAusencia.set(key, (semanasPorAusencia.get(key) || 0) + 1);
    }

    const substituicoesTimeline = Array.from(semanasPorAusencia.entries())
      .map(([semana, total]) => ({ semana, total }))
      .sort((a, b) => {
        const numA = parseInt(a.semana.split(" ")[1]);
        const numB = parseInt(b.semana.split(" ")[1]);
        return numA - numB;
      })
      .slice(-8);

    res.json({
      totalSubstituicoes,
      substituicoesAtribuidas,
      semDisponibilidade,
      pendentes,
      professoresMaisEscalados,
      substituicoesTimeline,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
