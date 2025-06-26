"use client"
import LoginForm from "@/components/dashboard/LoginForm";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// const queryClient = new QueryClient();

export default function Home() {
  return (
  //  <QueryClientProvider client={queryClient}>
   
      <LoginForm  />
  // </QueryClientProvider>
  );
}
