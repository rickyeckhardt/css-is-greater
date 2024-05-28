import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

async function fetchPost(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const posts = await fetchPost(params.id);

  const post = posts.length > 0 ? posts[0] : undefined;

  if (!post) {
    redirect('/');
  }

  return (
    <main className="max-w-md mx-auto flex flex-col space-y-6 mt-8">
      <div className="flex justify-between items-center">
        <Link href="/" className="border rounded-sm">
          <ChevronLeft />
        </Link>
        <Link
          href={`/posts/${post?.id}/edit`}
          className="border rounded-md px-4 py-1 bg-black text-white"
        >
          Edit Post
        </Link>
      </div>
      <header>
        <h1 className="text-3xl font-bold">{post?.title}</h1>
        <h2 className="text-md">Author: {post?.author}</h2>
      </header>
      <p className="max-w-prose text-lg">{post?.content}</p>
    </main>
  );
}
