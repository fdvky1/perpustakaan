import { getAuthSession } from '@/lib/auth'
import Book from '@/app/book/page';
import AdminDashboard from '@/app/dashboard/admin';

export default async function Dashboard(){
    const session = await getAuthSession();
    return ["admin", "operator"].includes(session!.user.role) ? <AdminDashboard/> : <Book/>
}