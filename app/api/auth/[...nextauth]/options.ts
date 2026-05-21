import { ApiResponse } from "@/app/types/apiResponse";
import axios, { AxiosError } from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password", required: false }, // Optional for OTP login
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials || {};

          // Check the authType to determine which API endpoint and payload to use
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            { email, password },
          );
          // Check for status code 311

          if (response.data.success === false) {
            throw new Error(response.data.message);
          }
          console.log("response", response?.data);
          return response.data;
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          throw new Error(
            axiosError.response?.data?.message || "Something went wrong",
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userData = user?.user;
        token.id = userData?._id;
        token.token = user?.token;
        token.email = userData?.email;
        token.name = userData?.name;
        token.isVerified = userData?.isVerified;
        token.role = userData?.role;
        token.mobileNumber = userData?.mobileNumber;
        token.isBlocked = userData?.isBlocked;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        token: token?.token as string,
        user: {
          _id: token?.id as string,
          name: token?.name as string,
          email: token?.email as string,
          isVerified: token?.isVerified as boolean,
          role: token?.role as string,
          isBlocked: token?.isBlocked as boolean,
          mobileNumber: token?.mobileNumber as string,
        },
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
};
