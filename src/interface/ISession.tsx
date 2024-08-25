export interface DefaultSession extends Record<string, unknown> {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires?: string;
  }