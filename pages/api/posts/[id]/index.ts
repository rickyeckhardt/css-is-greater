import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cssToJson } from '@/lib/utils';

const cssFilePath = path.join(process.cwd(), 'public', 'styles', 'posts.css');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(cssFilePath, 'utf8');
      const regex = new RegExp(`\\.post-${id} \\{([^}]+)\\}`);
      const match = data.match(regex);
      if (match) {
        const singlePostCss = `.post-${id} {${match[1]}}`;
        const postJson = cssToJson(singlePostCss);

        return res.status(200).json(postJson[0]);
      } else {
        return res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read CSS file' });
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
      let data = fs.readFileSync(cssFilePath, 'utf8');
      const regex = new RegExp(`\\.post-${id} \\{([^}]+)\\}`, 'g');
      data = data.replace(regex, newPost);
      fs.writeFileSync(cssFilePath, data, 'utf8');
      return res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update CSS file' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      let data = fs.readFileSync(cssFilePath, 'utf8');
      const regex = new RegExp(`\\.post-${id} \\{([^}]+)\\}`, 'g');
      data = data.replace(regex, '');
      fs.writeFileSync(cssFilePath, data, 'utf8');
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
