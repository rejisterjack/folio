#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/9aac6d8c1f1d3c34db84d9e1de31d8d450632434b563cc268e6c1cdb02187841/contract';
import endContract from '../../snapshots/9aac6d8c1f1d3c34db84d9e1de31d8d450632434b563cc268e6c1cdb02187841/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'ApiKey',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('keyHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('prefix', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('revokedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AuditEvent',
        columns: [
          col('action', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('actorEmail', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('actorId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('after', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('before', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('promptKey', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Prompt',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', {
            notNull: true,
            default: lit(''),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'PromptDeployment',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('env', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('promptId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('versionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'PromptDeployment_env_check_f600d2c9',
            sql`"env" IN ('development', 'staging', 'production')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'PromptVersion',
        columns: [
          col('authorId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('message', 'text', {
            notNull: true,
            default: lit(''),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('promptId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('version', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Session',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ApiKey',
        constraint: 'ApiKey_keyHash_key',
        columns: ['keyHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Prompt',
        constraint: 'Prompt_key_key',
        columns: ['key'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'PromptDeployment',
        constraint: 'PromptDeployment_promptId_env_key',
        columns: ['promptId', 'env'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'PromptVersion',
        constraint: 'PromptVersion_promptId_version_key',
        columns: ['promptId', 'version'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Session',
        constraint: 'Session_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ApiKey',
        index: 'ApiKey_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AuditEvent',
        index: 'AuditEvent_actorId_idx_a58f6b4b',
        columns: ['actorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AuditEvent',
        index: 'AuditEvent_createdAt_idx_9575dbd7',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AuditEvent',
        index: 'AuditEvent_promptKey_createdAt_idx_4a1b1e6c',
        columns: ['promptKey', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PromptDeployment',
        index: 'PromptDeployment_promptId_idx_a2f13cad',
        columns: ['promptId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PromptDeployment',
        index: 'PromptDeployment_versionId_idx_ef8aa804',
        columns: ['versionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PromptVersion',
        index: 'PromptVersion_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PromptVersion',
        index: 'PromptVersion_promptId_idx_a2f13cad',
        columns: ['promptId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Session',
        index: 'Session_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ApiKey',
        foreignKey: {
          name: 'ApiKey_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AuditEvent',
        foreignKey: {
          name: 'AuditEvent_actorId_fkey',
          columns: ['actorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PromptDeployment',
        foreignKey: {
          name: 'PromptDeployment_promptId_fkey',
          columns: ['promptId'],
          references: { schema: 'public', table: 'Prompt', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PromptDeployment',
        foreignKey: {
          name: 'PromptDeployment_versionId_fkey',
          columns: ['versionId'],
          references: { schema: 'public', table: 'PromptVersion', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PromptVersion',
        foreignKey: {
          name: 'PromptVersion_promptId_fkey',
          columns: ['promptId'],
          references: { schema: 'public', table: 'Prompt', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PromptVersion',
        foreignKey: {
          name: 'PromptVersion_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Session',
        foreignKey: {
          name: 'Session_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
