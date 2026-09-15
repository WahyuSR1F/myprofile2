import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Client-side auth handles the redirect via AuthProvider
  redirect('/admin/dashboard');
}
