import AppGuard from "./AppGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppGuard />
      {children}
    </>
  );
}

