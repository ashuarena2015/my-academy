"use client";

import React, { FC, useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import { request, gql } from 'graphql-request';
import {
  Link,
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
  Chip
} from "@heroui/react";

import { format } from 'date-fns';

const BlogPage: FC = () => {

  const [currentCatName, setCurrentCatName] = useState('');
  const [allPosts, setAllPosts] = useState<{ id: string; title: string; date: string; slug: string }[]>([]);
  const [allCategories, setAllCategories] = useState<{ id: string; name: string; count: number; slug: string }[]>([]);

  const getAllBlogs = async (catName) => {
    let query = "";
    if(catName) {
      query = gql` 
      {
        posts(where: { categoryName: "${catName}" }) {
          nodes {
            id
            postId
            slug
            title
            date,
            excerpt
            categories {
              nodes {
                id
                name
                slug
              }
            }
          }
        }
      }`
    } else {
        query = gql`
        {
          posts {
            nodes {
              id
              postId
              slug
              title
              date,
              excerpt
            }
          }
        }`;
    }

    const data = await request('http://localhost/my-academy-news-blogs/graphql', query) as { posts: { nodes: { id: string; title: string; date: string; slug: string }[] }};

    setAllPosts(data.posts.nodes);
  }

  const getAllCategories = async () => {
    const query = gql`
      {
        categories(where: {hideEmpty: true}) {
          nodes {
            id
            slug
            name
            count
          }
        }
      }`;

    const data = await request('http://localhost/my-academy-news-blogs/graphql', query) as { categories: { nodes: { id: string; name: string; count: number; slug: string }[] }};

    setAllCategories(data.categories.nodes);
  }

  useEffect(() => {
    getAllBlogs(currentCatName);
  }, [currentCatName]);

  useEffect(() => {
    getAllCategories();
  }, []);

  console.log({currentCatName});

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2">
        <Accordion className="flex flex-col p-0" variant="splitted">
          {allPosts?.map((post, i) => {
            return (
              <AccordionItem
                key={i}
                aria-label="Chung Miller"
                subtitle={format(post?.date, 'd MMMM yyyy')}
                title={post?.title}
                // className="bg-white p-4"
              >
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.excerpt || "") }} />
                <Link href={`/blogs/${post?.slug}`} className="text-sm my-2" underline="always">Read more</Link>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
      <div className="col-span-1 ml-4">
        <div className="w-full bg-white shadow-lg max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
          <Listbox aria-label="Dynamic Actions" items={allCategories || []} onAction={(slug) => setCurrentCatName(slug)}>
            {(item) => (
              <ListboxItem
                key={item.slug}
                // className={item.key === "delete" ? "text-danger" : ""}
                // color={item.key === "delete" ? "danger" : "default"}
                endContent={
                  item.count ? <Chip className="w-4 h-6 text-xs text-slate-600 bg-orange-300">{item.count}</Chip> : null
                }
              >
                {item.name}
              </ListboxItem>
            )}
          </Listbox>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
