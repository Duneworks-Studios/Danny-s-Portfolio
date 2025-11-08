'use client';

import { usePathname } from 'next/navigation';

export default function AdminRoutesOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (!isAdminRoute) {
    return null;
  }

  return <>{children}</>;
}

