"use client";

import React, { FC, useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import { request, gql } from 'graphql-request';
import { useParams, useRouter } from "next/navigation";
import {
  Listbox,
  ListboxItem
} from "@heroui/react";


const BlogPage: FC = () => {

  const router = useRouter();
  const [postInfo, setPostInfo] = useState<{ title?: string; content?: string; }>({});
  const [currentCatName, setCurrentCatName] = useState<string | undefined>();

  const [otherPosts, setOtherPosts] = useState<{ id: string; postId: string; slug: string; title: string; date: string; excerpt: string; }[]>([]);

  const { id } = useParams();
  const getBlog = async () => {
    const query = gql`
      {
        post(id: "${id}", idType: SLUG) {
          title
          content
          slug
          categories {
            nodes {
              id
              name
              slug
            }
          }
        }
      }`;

    const data = await request('http://localhost/my-academy-news-blogs/graphql', query) as { post: { title: string; content: string; categories: { nodes: [ { slug: string; }]}}; };
    setCurrentCatName(data.post.categories.nodes[0].slug)
    setPostInfo({ title: data.post.title, content: data.post.content });
  
  }

  const getOtherPostsFromCategory = async (catName: string) => {
    const query = gql`
      {
        posts(where: { categoryName: "${catName}" }) {
          nodes {
            id
            postId
            slug
            title
            date,
            excerpt
          }
        }
      }
    `;
  
    const data = await request<{ posts: { nodes: { id: string; postId: string; slug: string; title: string; date: string; excerpt: string; }[] } }>('http://localhost/my-academy-news-blogs/graphql', query);
    setOtherPosts(data.posts.nodes);
  }

  useEffect(() => {
    getBlog();
  }, []);

  useEffect(() => {
    currentCatName && getOtherPostsFromCategory(currentCatName)
  }, [currentCatName]);

  console.log({otherPosts});

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2">
        <h1 className="text-2xl mb-4 font-semibold">{postInfo?.title}</h1>
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: DOMPurify?.sanitize(postInfo?.content || "") }} />
      </div>
      {otherPosts?.length > 1 ? <div className="col-span-1 ml-4">
        <h1 className="text-2xl mb-4">Also see</h1>
        <div className="w-full bg-white shadow-lg max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
          <Listbox aria-label="Dynamic Actions" items={otherPosts.filter(x => x.title !== postInfo.title) || []} onAction={(slug) => router.push(`/blogs/${slug}`)}>
            {(item) => (
              <ListboxItem
                key={item.slug}
              >
                {item.title}
              </ListboxItem>
            )}
          </Listbox>
        </div>
      </div> : null }
    </div>
  );
}

export default BlogPage;
