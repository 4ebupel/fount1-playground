// next-env.d.ts

/// <reference types="next" />
/// <reference types="next/types/global" />

import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      authToken: string;
    };
  }

  interface User {
    id: string;
    authToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    id?: string;
  }
}