import TablesPosts from '@/components/tables/posts/tables-posts'
import { GetDataInServerSide } from '@/lib/actions/get-server'
import { IPosts } from '@/lib/types/posts/type'


export default async function ArticlesPage() {
  const { data: posts, message , error } = await GetDataInServerSide<IPosts[]>({
    End_Point: "/posts",
    ExtraMethod: {
      store: "no-store"
    }
  })


  if (!posts ||error) {
    return <div className='flex items-center justify-center text-red-500 text-center h-screen text-5xl'>{message}</div>
  }

  return (
    <main className='p-4'>
      <TablesPosts posts={posts} />
    </main>
  )
}