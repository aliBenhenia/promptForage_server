import MainLayout from '@/components/layout/main-layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PromptForge Dashboard',
  description: 'Your AI developer tools dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}