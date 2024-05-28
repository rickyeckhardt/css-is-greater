'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type FormValues = {
  title: string;
  author?: string;
  content: string;
};

export default function EditPostPage({ params }: { params: { id: string } }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();
  const postId = params.id;

  useEffect(() => {
    const fetchPostData = async () => {
      const res = await fetch(`/api/posts/${postId}`);
      if (res.ok) {
        const post = await res.json();

        setValue('title', post.title);
        setValue('author', post.author);
        setValue('content', post.content);
      } else {
        console.error('Failed to fetch post data');
      }
    };

    fetchPostData();
  }, [postId, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await fetch(
      `/api/posts/${postId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      router.push('/');
    } else {
      alert('Failed to update post');
    }
  };

  const deletePost = async () => {
    const res = await fetch(
      `/api/posts/${postId}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      router.push('/');
    } else {
      alert('Failed to delete post');
    }
  };

  return (
    <main className="max-w-md mx-auto flex flex-col space-y-6 mt-8">
      <div className="flex items-center gap-x-4">
        <Link href={`/posts/${params?.id}`} className="border rounded-sm">
          <ChevronLeft />
        </Link>
        <h1 className="text-2xl">Edit Post</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            className="border rounded p-2 w-full"
            {...register('title', { required: true })}
          />
          {errors.title && (
            <span className="text-red-500">Title is required</span>
          )}
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium">
            Author (optional)
          </label>
          <input
            id="author"
            className="border rounded p-2 w-full"
            {...register('author')}
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Post
          </label>
          <textarea
            id="content"
            className="border rounded p-2 w-full"
            {...register('content', { required: true })}
          />
          {errors.content && (
            <span className="text-red-500">Content is required</span>
          )}
        </div>
        <button
          type="submit"
          className="border rounded-md px-4 py-2 bg-black text-white"
        >
          Update Post
        </button>
        <button
          type="button"
          onClick={deletePost}
          className="border rounded-md px-4 py-2 mt-2 bg-red-500 text-white"
        >
          Delete Post
        </button>
      </form>
    </main>
  );
}
