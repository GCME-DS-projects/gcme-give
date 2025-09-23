import AdminLayout from "./AdminLayout";
import ReactQueryProvider from "./ReactQueryProvider";

export default function AdminSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AdminLayout>{children}</AdminLayout>
    </ReactQueryProvider>
  );
}
