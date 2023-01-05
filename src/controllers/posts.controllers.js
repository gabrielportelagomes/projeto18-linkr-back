import getMetaData from "metadata-scraper";

import postRepository from "../repositories/posts.repository.js";

export async function getPosts(req, res) {
  try {
    const postsData = await postRepository.getPosts();
    const formattedData = await Promise.all(
      postsData.map(async (post) => {
        const metadata = await getMetaData(post.url);

        return { ...post, metadata: {
         icon: metadata.icon,
         title: metadata.title,
         description: metadata.description 
        }};
      }));

    return res.status(200).send(formattedData);
  } catch (e) {
    return res.sendStatus(500);
  };
};

export async function publishPost(req, res) {
  const { userId, description, url, hashtagsArray } = req.body;

  try {
    const postId = await postRepository.publishPost(userId, description, url);

    if (hashtagsArray.length > 0) await postRepository.insertHashtags(hashtagsArray, postId);

    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err);
  };
};
