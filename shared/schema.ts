import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Professores
export const professores = pgTable("professores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  areaConhecimento: text("area_conhecimento").notNull(),
  cargaHoraria: integer("carga_horaria").notNull().default(0),
});

export const insertProfessorSchema = createInsertSchema(professores).omit({
  id: true,
  cargaHoraria: true,
});

export type InsertProfessor = z.infer<typeof insertProfessorSchema>;
export type Professor = typeof professores.$inferSelect;

// Disciplinas
export const disciplinas = pgTable("disciplinas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  areaConhecimento: text("area_conhecimento").notNull(),
});

export const insertDisciplinaSchema = createInsertSchema(disciplinas).omit({
  id: true,
});

export type InsertDisciplina = z.infer<typeof insertDisciplinaSchema>;
export type Disciplina = typeof disciplinas.$inferSelect;

// Turmas
export const turmas = pgTable("turmas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
});

export const insertTurmaSchema = createInsertSchema(turmas).omit({
  id: true,
});

export type InsertTurma = z.infer<typeof insertTurmaSchema>;
export type Turma = typeof turmas.$inferSelect;

// Ausências
export const ausencias = pgTable("ausencias", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  professorId: varchar("professor_id").notNull(),
  disciplinaId: varchar("disciplina_id").notNull(),
  turmaId: varchar("turma_id").notNull(),
  diaSemana: integer("dia_semana").notNull(), // 0=Segunda, 1=Terça, 2=Quarta, 3=Quinta, 4=Sexta
  horarioInicio: text("horario_inicio").notNull(), // formato "HH:MM"
  duracao: integer("duracao").notNull(), // em horas
  semana: integer("semana").notNull(), // número da semana do ano
  ano: integer("ano").notNull(),
});

export const insertAusenciaSchema = createInsertSchema(ausencias).omit({
  id: true,
}).extend({
  diaSemana: z.number().min(0).max(4),
  horarioInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  duracao: z.number().min(1).max(8),
  semana: z.number().min(1).max(53),
  ano: z.number().min(2024),
});

export type InsertAusencia = z.infer<typeof insertAusenciaSchema>;
export type Ausencia = typeof ausencias.$inferSelect;

// Substituições
export const substituicoes = pgTable("substituicoes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ausenciaId: varchar("ausencia_id").notNull(),
  professorSubstitutoId: varchar("professor_substituto_id"),
  status: text("status").notNull().default("pendente"), // pendente, atribuida, sem_disponibilidade
  mensagem: text("mensagem"),
});

export const insertSubstituicaoSchema = createInsertSchema(substituicoes).omit({
  id: true,
});

export type InsertSubstituicao = z.infer<typeof insertSubstituicaoSchema>;
export type Substituicao = typeof substituicoes.$inferSelect;
