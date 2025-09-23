import AdminLayout from "./admin-layout";
import ReactQueryProvider from "./react-query-provider";

export default function AdminSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AdminLayout>{children}</AdminLayout>
    </ReactQueryProvider>
  );
}
