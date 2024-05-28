'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const postId = params.id;

  useEffect(() => {
    const fetchPost = async (id: string) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`);

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();

        console.log(data)

        setPost( data || null);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPost(postId);
  }, [postId]);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <main className="max-w-md mx-auto flex flex-col space-y-6 mt-8">
      <div className="flex justify-between items-center">
        <Link href="/" className="border rounded-sm">
          <ChevronLeft />
        </Link>
        {post && (
          <Link
            href={`/posts/${post.id}/edit`}
            className="border rounded-md px-4 py-1 bg-black text-white"
          >
            Edit Post
          </Link>
        )}
      </div>
      {post && (
        <>
          <header>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <h2 className="text-md">Author: {post.author}</h2>
          </header>
          <p className="max-w-prose text-lg">{post.content}</p>
        </>
      )}
    </main>
  );
}
