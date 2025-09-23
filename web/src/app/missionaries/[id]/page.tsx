import { notFound } from "next/navigation";
import MissionaryDetail from "./missionary-detail";

interface PageProps {
  params?: Promise<{ id: string }>;
  searchParams?: Promise<any>;
}

async function getMissionary(id: string) {
  try {
    // Use host.docker.internal:3001 if running in Docker, otherwise localhost:3001
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
      (process.env.DOCKER
        ? "http://host.docker.internal:3001"
        : "http://localhost:3001");
    const response = await fetch(`${base}/api/admin/missionaries/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch missionary");
    const missionary = await response.json();
    if (!missionary || missionary.error) return null;
    return missionary;
  } catch (error) {
    console.error("Error fetching missionary:", error);
    return null;
  }
}

export default async function MissionaryDetailPage({ params }: PageProps) {
  const resolvedParams = params ? await params : undefined;
  const { id } = resolvedParams || {};

  if (!id) {
    notFound();
  }

  const missionary = await getMissionary(id);

  if (!missionary) {
    notFound();
  }

  return <MissionaryDetail missionary={missionary} />;
}
