import "next-auth";

declare module "next-auth" {
  interface User {
    token?: string;
    user: {
      name: string;
      email: string;
      _id: string;
      isVerified: boolean;
      role: string;
      isBlocked: boolean;
      mobileNumber: string;
    };
  }
  interface Session {
    user: {
      token?: string;
      user: {
        name: string;
        email: string;
        _id: string;
        isVerified: boolean;
        role: string;
        isBlocked: boolean;
        mobileNumber: string;
      };
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    token?: string;
    user: {
      name: string;
      email: string;
      _id: string;
      isVerified: boolean;
      role: string;
      isBlocked: boolean;
      mobileNumber: string;
    };
  }
}
