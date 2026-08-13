declare module 'node:sqlite' {
  export interface StatementResultingChanges {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export interface StatementSync {
    run(...anonymousParameters: unknown[]): StatementResultingChanges;
    get(...anonymousParameters: unknown[]): Record<string, unknown> | undefined;
    all(...anonymousParameters: unknown[]): Record<string, unknown>[];
  }

  export interface DatabaseSync {
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }

  export function DatabaseSync(
    path?: string,
    options?: { open?: boolean; readOnly?: boolean; enableForeignKeyConstraints?: boolean }
  ): DatabaseSync;
}