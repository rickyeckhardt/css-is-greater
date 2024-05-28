import type { NextApiRequest, NextApiResponse } from 'next';
import { put, del, list } from '@vercel/blob';
import { cssToJson } from '@/lib/utils';

const BLOB_PREFIX = 'posts-';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: `${BLOB_PREFIX}${id}`, token: process.env.BLOB_READ_WRITE_TOKEN });
      if (blobs.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      const response = await fetch(blobs[0].url);
      const cssContent = await response.text();
      const postJson = cssToJson(cssContent);

      return res.status(200).json(postJson[0]);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch post', details: err.message });
    }
  }

  if (req.method === 'PUT') {
    const { title, author, content } = req.body;
    if (!title || !author || !content) {
      return res.status(400).json({ error: 'Title, author, and content are required' });
    }

    const newPost = `
      .post-${id} {
        --title: "${title.replace(/"/g, '\\"')}";
        --author: "${author.replace(/"/g, '\\"')}";
        --content: "${content.replace(/"/g, '\\"')}";
      }
    `;

    try {
      const blob = await put(`${BLOB_PREFIX}${id}.css`, newPost, {
        access: 'public',
        contentType: 'text/css',
      });

      return res.status(200).json({ message: 'Post updated successfully', url: blob.url });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update post', details: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { blobs } = await list({ prefix: `${BLOB_PREFIX}${id}`, token: process.env.BLOB_READ_WRITE_TOKEN });
      if (blobs.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      const blobUrl = blobs[0].url;
      await del(blobUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to delete post', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
