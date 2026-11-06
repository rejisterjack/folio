#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3045ad0db7b18fb75e4c92be611ad3ceaf79ffb68eb141adeea1a4ddf0cffc6e/contract';
import endContract from '../../snapshots/3045ad0db7b18fb75e4c92be611ad3ceaf79ffb68eb141adeea1a4ddf0cffc6e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/9aac6d8c1f1d3c34db84d9e1de31d8d450632434b563cc268e6c1cdb02187841/contract';
import startContract from '../../snapshots/9aac6d8c1f1d3c34db84d9e1de31d8d450632434b563cc268e6c1cdb02187841/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('role', 'text', {
          notNull: true,
          default: lit('member'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'User',
        constraint: 'User_role_check_db2a8df6',
        expression: sql`"role" IN ('admin', 'member')`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
