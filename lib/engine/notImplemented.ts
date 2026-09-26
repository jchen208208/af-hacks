export function notImplemented(what: string): never {
  throw new Error(`${what} is not implemented yet (Phase 1).`);
}
