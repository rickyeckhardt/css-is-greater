import { NextApiRequest, NextApiResponse } from 'next';
import { put, list } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { cssToJson } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'posts-', token: process.env.BLOB_READ_WRITE_TOKEN });

      const posts = await Promise.all(blobs.map(async (blob) => {
        const response = await fetch(blob.url);
        const cssContent = await response.text();
        return cssToJson(cssContent);
      }));

      return res.status(200).json(posts.flat());
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
    }
  }

  if (req.method === 'POST') {
    const { title, author, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const postId = uuidv4();
    
    const cssContent = `
      .post-${postId} {
        --title: '${title.replace(/'/g, "\\'")}';
        --author: '${author?.replace(/'/g, "\\'") || ''}';
        --content: '${content.replace(/'/g, "\\'")}';
      }
    `;

    try {
      const blob = await put(`posts-${postId}.css`, cssContent, {
        access: 'public',
        contentType: 'text/css',
      });

      return res.status(200).json({ message: 'Post added successfully', id: postId, url: blob.url });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to write to CSS file', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
