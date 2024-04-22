import { getAuthSession } from '@/lib/auth'
import Book from '@/app/book/page';
import AdminDashboard from '@/app/dashboard/admin';

export default async function Dashboard({
    searchParams
}: {
    searchParams?: {
        keyword?: string;
        page?: string;
    }
}){
    const session = await getAuthSession();
    return ["admin", "operator"].includes(session!.user.role) ? <AdminDashboard/> : <Book searchParams={{keyword: searchParams?.keyword, page: searchParams?.page}}/>
}