import { getSession } from "@/lib/auth";
import ClientLayout from "@/components/ClientLayout";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <ClientLayout session={session}>{children}</ClientLayout>
      </body>
    </html>
  );
}
