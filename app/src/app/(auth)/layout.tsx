import { AuthProvider } from "@/providers/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider>{children} </AuthProvider>;
}
