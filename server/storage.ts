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
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private professores: Map<string, Professor>;
  private disciplinas: Map<string, Disciplina>;
  private turmas: Map<string, Turma>;
  private ausencias: Map<string, Ausencia>;
  private substituicoes: Map<string, Substituicao>;

  constructor() {
    this.professores = new Map();
    this.disciplinas = new Map();
    this.turmas = new Map();
    this.ausencias = new Map();
    this.substituicoes = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed Professores
    const prof1 = this.createProfessorSync({
      nome: "Maria Silva",
      areaConhecimento: "Matemática",
    });
    const prof2 = this.createProfessorSync({
      nome: "João Santos",
      areaConhecimento: "Matemática",
    });
    const prof3 = this.createProfessorSync({
      nome: "Ana Oliveira",
      areaConhecimento: "História",
    });
    const prof4 = this.createProfessorSync({
      nome: "Pedro Costa",
      areaConhecimento: "Ciências",
    });

    // Seed Disciplinas
    this.createDisciplinaSync({
      nome: "Matemática I",
      areaConhecimento: "Matemática",
    });
    this.createDisciplinaSync({
      nome: "Álgebra",
      areaConhecimento: "Matemática",
    });
    this.createDisciplinaSync({
      nome: "História do Brasil",
      areaConhecimento: "História",
    });
    this.createDisciplinaSync({
      nome: "Biologia",
      areaConhecimento: "Ciências",
    });

    // Seed Turmas
    this.createTurmaSync({ nome: "1º Ano A" });
    this.createTurmaSync({ nome: "2º Ano B" });
    this.createTurmaSync({ nome: "3º Ano C" });
  }

  private createProfessorSync(professor: InsertProfessor): Professor {
    const id = randomUUID();
    const newProfessor: Professor = { ...professor, id, cargaHoraria: 0 };
    this.professores.set(id, newProfessor);
    return newProfessor;
  }

  private createDisciplinaSync(disciplina: InsertDisciplina): Disciplina {
    const id = randomUUID();
    const newDisciplina: Disciplina = { ...disciplina, id };
    this.disciplinas.set(id, newDisciplina);
    return newDisciplina;
  }

  private createTurmaSync(turma: InsertTurma): Turma {
    const id = randomUUID();
    const newTurma: Turma = { ...turma, id };
    this.turmas.set(id, newTurma);
    return newTurma;
  }

  // Professores
  async getAllProfessores(): Promise<Professor[]> {
    return Array.from(this.professores.values());
  }

  async getProfessor(id: string): Promise<Professor | undefined> {
    return this.professores.get(id);
  }

  async createProfessor(professor: InsertProfessor): Promise<Professor> {
    const id = randomUUID();
    const newProfessor: Professor = { ...professor, id, cargaHoraria: 0 };
    this.professores.set(id, newProfessor);
    return newProfessor;
  }

  async updateProfessor(id: string, professor: Partial<InsertProfessor>): Promise<Professor | undefined> {
    const existing = this.professores.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...professor };
    this.professores.set(id, updated);
    return updated;
  }

  async deleteProfessor(id: string): Promise<boolean> {
    return this.professores.delete(id);
  }

  async updateCargaHoraria(id: string, novaCarga: number): Promise<void> {
    const professor = this.professores.get(id);
    if (professor) {
      professor.cargaHoraria = novaCarga;
      this.professores.set(id, professor);
    }
  }

  // Disciplinas
  async getAllDisciplinas(): Promise<Disciplina[]> {
    return Array.from(this.disciplinas.values());
  }

  async getDisciplina(id: string): Promise<Disciplina | undefined> {
    return this.disciplinas.get(id);
  }

  async createDisciplina(disciplina: InsertDisciplina): Promise<Disciplina> {
    const id = randomUUID();
    const newDisciplina: Disciplina = { ...disciplina, id };
    this.disciplinas.set(id, newDisciplina);
    return newDisciplina;
  }

  async updateDisciplina(id: string, disciplina: Partial<InsertDisciplina>): Promise<Disciplina | undefined> {
    const existing = this.disciplinas.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...disciplina };
    this.disciplinas.set(id, updated);
    return updated;
  }

  async deleteDisciplina(id: string): Promise<boolean> {
    return this.disciplinas.delete(id);
  }

  // Turmas
  async getAllTurmas(): Promise<Turma[]> {
    return Array.from(this.turmas.values());
  }

  async getTurma(id: string): Promise<Turma | undefined> {
    return this.turmas.get(id);
  }

  async createTurma(turma: InsertTurma): Promise<Turma> {
    const id = randomUUID();
    const newTurma: Turma = { ...turma, id };
    this.turmas.set(id, newTurma);
    return newTurma;
  }

  async updateTurma(id: string, turma: Partial<InsertTurma>): Promise<Turma | undefined> {
    const existing = this.turmas.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...turma };
    this.turmas.set(id, updated);
    return updated;
  }

  async deleteTurma(id: string): Promise<boolean> {
    return this.turmas.delete(id);
  }

  // Ausências
  async getAllAusencias(): Promise<Ausencia[]> {
    return Array.from(this.ausencias.values());
  }

  async getAusenciasBySemana(semana: number, ano: number): Promise<Ausencia[]> {
    return Array.from(this.ausencias.values()).filter(
      (a) => a.semana === semana && a.ano === ano
    );
  }

  async getAusencia(id: string): Promise<Ausencia | undefined> {
    return this.ausencias.get(id);
  }

  async createAusencia(ausencia: InsertAusencia): Promise<Ausencia> {
    const id = randomUUID();
    const newAusencia: Ausencia = { ...ausencia, id };
    this.ausencias.set(id, newAusencia);

    // Criar substituição pendente automaticamente
    await this.createSubstituicao({
      ausenciaId: id,
      professorSubstitutoId: null,
      status: "pendente",
      mensagem: null,
    });

    return newAusencia;
  }

  async deleteAusencia(id: string): Promise<boolean> {
    // Deletar também a substituição associada
    const substituicoes = Array.from(this.substituicoes.values());
    const substituicao = substituicoes.find((s) => s.ausenciaId === id);
    if (substituicao) {
      this.substituicoes.delete(substituicao.id);
    }
    return this.ausencias.delete(id);
  }

  // Substituições
  async getAllSubstituicoes(): Promise<Substituicao[]> {
    return Array.from(this.substituicoes.values());
  }

  async getSubstituicao(id: string): Promise<Substituicao | undefined> {
    return this.substituicoes.get(id);
  }

  async getSubstituicaoBySemana(semana: number, ano: number): Promise<Substituicao[]> {
    const ausencias = await this.getAusenciasBySemana(semana, ano);
    const ausenciaIds = new Set(ausencias.map((a) => a.id));
    return Array.from(this.substituicoes.values()).filter((s) =>
      ausenciaIds.has(s.ausenciaId)
    );
  }

  async createSubstituicao(substituicao: InsertSubstituicao): Promise<Substituicao> {
    const id = randomUUID();
    const newSubstituicao: Substituicao = {
      id,
      ausenciaId: substituicao.ausenciaId,
      professorSubstitutoId: substituicao.professorSubstitutoId ?? null,
      status: substituicao.status ?? "pendente",
      mensagem: substituicao.mensagem ?? null,
    };
    this.substituicoes.set(id, newSubstituicao);
    return newSubstituicao;
  }

  async updateSubstituicao(id: string, substituicao: Partial<InsertSubstituicao>): Promise<Substituicao | undefined> {
    const existing = this.substituicoes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...substituicao };
    this.substituicoes.set(id, updated);
    return updated;
  }

  async deleteSubstituicao(id: string): Promise<boolean> {
    return this.substituicoes.delete(id);
  }
}

export const storage = new MemStorage();
