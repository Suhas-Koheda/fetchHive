import Chat from "@/features/home/ui/chat/chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ChatPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return <Chat userId={session.user.id} />;
}
