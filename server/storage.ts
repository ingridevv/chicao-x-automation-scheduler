import {
  type Professor,
  type InsertProfessor,
  type Disciplina,
  type InsertDisciplina,
  type Turma,
  type InsertTurma,
  type Ausencia,
  type InsertAusencia,
  type Substituicao,
  type InsertSubstituicao,
  professores,
  disciplinas,
  turmas,
  ausencias,
  substituicoes,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // Professores
  getAllProfessores(): Promise<Professor[]>;
  getProfessor(id: string): Promise<Professor | undefined>;
  createProfessor(professor: InsertProfessor): Promise<Professor>;
  updateProfessor(id: string, professor: Partial<InsertProfessor>): Promise<Professor | undefined>;
  deleteProfessor(id: string): Promise<boolean>;
  updateCargaHoraria(id: string, novaCarga: number): Promise<void>;

  // Disciplinas
  getAllDisciplinas(): Promise<Disciplina[]>;
  getDisciplina(id: string): Promise<Disciplina | undefined>;
  createDisciplina(disciplina: InsertDisciplina): Promise<Disciplina>;
  updateDisciplina(id: string, disciplina: Partial<InsertDisciplina>): Promise<Disciplina | undefined>;
  deleteDisciplina(id: string): Promise<boolean>;

  // Turmas
  getAllTurmas(): Promise<Turma[]>;
  getTurma(id: string): Promise<Turma | undefined>;
  createTurma(turma: InsertTurma): Promise<Turma>;
  updateTurma(id: string, turma: Partial<InsertTurma>): Promise<Turma | undefined>;
  deleteTurma(id: string): Promise<boolean>;

  // Ausências
  getAllAusencias(): Promise<Ausencia[]>;
  getAusenciasBySemana(semana: number, ano: number): Promise<Ausencia[]>;
  getAusencia(id: string): Promise<Ausencia | undefined>;
  createAusencia(ausencia: InsertAusencia): Promise<Ausencia>;
  deleteAusencia(id: string): Promise<boolean>;

  // Substituições
  getAllSubstituicoes(): Promise<Substituicao[]>;
  getSubstituicao(id: string): Promise<Substituicao | undefined>;
  getSubstituicaoBySemana(semana: number, ano: number): Promise<Substituicao[]>;
  createSubstituicao(substituicao: InsertSubstituicao): Promise<Substituicao>;
  updateSubstituicao(id: string, substituicao: Partial<InsertSubstituicao>): Promise<Substituicao | undefined>;
  deleteSubstituicao(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Professores
  async getAllProfessores(): Promise<Professor[]> {
    return await db.select().from(professores);
  }

  async getProfessor(id: string): Promise<Professor | undefined> {
    const [professor] = await db.select().from(professores).where(eq(professores.id, id));
    return professor;
  }

  async createProfessor(professor: InsertProfessor): Promise<Professor> {
    const [newProfessor] = await db.insert(professores).values(professor).returning();
    return newProfessor;
  }

  async updateProfessor(id: string, professor: Partial<InsertProfessor>): Promise<Professor | undefined> {
    const [updated] = await db
      .update(professores)
      .set(professor)
      .where(eq(professores.id, id))
      .returning();
    return updated;
  }

  async deleteProfessor(id: string): Promise<boolean> {
    const [deleted] = await db.delete(professores).where(eq(professores.id, id)).returning();
    return !!deleted;
  }

  async updateCargaHoraria(id: string, novaCarga: number): Promise<void> {
    await db.update(professores).set({ cargaHoraria: novaCarga }).where(eq(professores.id, id));
  }

  // Disciplinas
  async getAllDisciplinas(): Promise<Disciplina[]> {
    return await db.select().from(disciplinas);
  }

  async getDisciplina(id: string): Promise<Disciplina | undefined> {
    const [disciplina] = await db.select().from(disciplinas).where(eq(disciplinas.id, id));
    return disciplina;
  }

  async createDisciplina(disciplina: InsertDisciplina): Promise<Disciplina> {
    const [newDisciplina] = await db.insert(disciplinas).values(disciplina).returning();
    return newDisciplina;
  }

  async updateDisciplina(id: string, disciplina: Partial<InsertDisciplina>): Promise<Disciplina | undefined> {
    const [updated] = await db
      .update(disciplinas)
      .set(disciplina)
      .where(eq(disciplinas.id, id))
      .returning();
    return updated;
  }

  async deleteDisciplina(id: string): Promise<boolean> {
    const [deleted] = await db.delete(disciplinas).where(eq(disciplinas.id, id)).returning();
    return !!deleted;
  }

  // Turmas
  async getAllTurmas(): Promise<Turma[]> {
    return await db.select().from(turmas);
  }

  async getTurma(id: string): Promise<Turma | undefined> {
    const [turma] = await db.select().from(turmas).where(eq(turmas.id, id));
    return turma;
  }

  async createTurma(turma: InsertTurma): Promise<Turma> {
    const [newTurma] = await db.insert(turmas).values(turma).returning();
    return newTurma;
  }

  async updateTurma(id: string, turma: Partial<InsertTurma>): Promise<Turma | undefined> {
    const [updated] = await db
      .update(turmas)
      .set(turma)
      .where(eq(turmas.id, id))
      .returning();
    return updated;
  }

  async deleteTurma(id: string): Promise<boolean> {
    const [deleted] = await db.delete(turmas).where(eq(turmas.id, id)).returning();
    return !!deleted;
  }

  // Ausências
  async getAllAusencias(): Promise<Ausencia[]> {
    return await db.select().from(ausencias);
  }

  async getAusenciasBySemana(semana: number, ano: number): Promise<Ausencia[]> {
    return await db
      .select()
      .from(ausencias)
      .where(and(eq(ausencias.semana, semana), eq(ausencias.ano, ano)));
  }

  async getAusencia(id: string): Promise<Ausencia | undefined> {
    const [ausencia] = await db.select().from(ausencias).where(eq(ausencias.id, id));
    return ausencia;
  }

  async createAusencia(ausencia: InsertAusencia): Promise<Ausencia> {
    const [newAusencia] = await db.insert(ausencias).values(ausencia).returning();
    
    // Criar substituição pendente automaticamente
    await this.createSubstituicao({
      ausenciaId: newAusencia.id,
      professorSubstitutoId: null,
      status: "pendente",
      mensagem: null,
    });

    return newAusencia;
  }

  async deleteAusencia(id: string): Promise<boolean> {
    await db.delete(substituicoes).where(eq(substituicoes.ausenciaId, id));
    const [deleted] = await db.delete(ausencias).where(eq(ausencias.id, id)).returning();
    return !!deleted;
  }

  // Substituições
  async getAllSubstituicoes(): Promise<Substituicao[]> {
    return await db.select().from(substituicoes);
  }

  async getSubstituicao(id: string): Promise<Substituicao | undefined> {
    const [substituicao] = await db.select().from(substituicoes).where(eq(substituicoes.id, id));
    return substituicao;
  }

  async getSubstituicaoBySemana(semana: number, ano: number): Promise<Substituicao[]> {
    const ausenciasInSemana = await this.getAusenciasBySemana(semana, ano);
    if (ausenciasInSemana.length === 0) return [];
    
    const ids = ausenciasInSemana.map(a => a.id);
    return await db.select().from(substituicoes).where(sql`${substituicoes.ausenciaId} IN ${ids}`);
  }

  async createSubstituicao(substituicao: InsertSubstituicao): Promise<Substituicao> {
    const [newSubstituicao] = await db.insert(substituicoes).values(substituicao).returning();
    return newSubstituicao;
  }

  async updateSubstituicao(id: string, substituicao: Partial<InsertSubstituicao>): Promise<Substituicao | undefined> {
    const [updated] = await db
      .update(substituicoes)
      .set(substituicao)
      .where(eq(substituicoes.id, id))
      .returning();
    return updated;
  }

  async deleteSubstituicao(id: string): Promise<boolean> {
    const [deleted] = await db.delete(substituicoes).where(eq(substituicoes.id, id)).returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();
