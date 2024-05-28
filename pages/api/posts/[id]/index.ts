import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cssToJson } from '@/lib/utils';

const cssFilePath = path.join(process.cwd(), 'styles', 'posts.css');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Post ID is required' });
    return;
  }

  if (req.method === 'GET') {
    fs.readFile(cssFilePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Failed to read CSS file' });
      } else {
        const regex = new RegExp(`\\.post-${id} \\{([^}]+)\\}`);
        const match = data.match(regex);
        if (match) {
          console.log('MATCH: ', match);
          res.status(200).json(cssToJson(match[0]));
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      }
    });
  } else if (req.method === 'DELETE') {
    fs.readFile(cssFilePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Failed to read CSS file' });
      } else {
        const regex = new RegExp(`\\.post-${id} \\{([^}]+)\\}`, 'g');
        const newData = data.replace(regex, '');
        fs.writeFile(cssFilePath, newData, 'utf8', (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to delete post' });
          } else {
            res.status(200).json({ message: 'Post deleted successfully' });
          }
        });
      }
    });
  } else if (req.method === 'PUT') {
    const { title, author, content } = req.body;

    if (!title || !author || !content) {
      res
        .status(400)
        .json({ error: 'Title, author, and content are required' });
      return;
    }

    const newPost = `
      .post-${id} {
        --title: "${title.replace(/"/g, '\\"')}";
        --author: "${author.replace(/"/g, '\\"')}";
        --content: "${content.replace(/"/g, '\\"')}";
      }
    `;

    fs.readFile(cssFilePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Failed to read CSS file' });
      } else {
        const regex = new RegExp(`\\.post-${id} \\{([^}]+)\\}`, 'g');
        const newData = data.replace(regex, newPost);
        fs.writeFile(cssFilePath, newData, 'utf8', (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to update post' });
          } else {
            res.status(200).json({ message: 'Post updated successfully' });
          }
        });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
