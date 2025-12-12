import React, { useState } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type { Props } from '@theme/BlogListPage';
import BlogPostItems from '@theme/BlogPostItems';
import Tag from '@site/src/components/Tag';
import styles from './styles.module.css';

function BlogListPageMetadata(props: Props): JSX.Element {
  const { metadata } = props;
  return (
    <>
      <PageMetadata title={metadata.blogTitle} description={metadata.blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): JSX.Element {
  const { metadata, items } = props;
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags from blog posts
  const allTags = new Set<string>();
  items.forEach((item) => {
    item.content.metadata.tags.forEach((tag) => {
      allTags.add(tag.label);
    });
  });

  // Filter items based on selected tag
  const filteredItems = selectedTag
    ? items.filter((item) =>
        item.content.metadata.tags.some((tag) => tag.label === selectedTag)
      )
    : items;

  // Sort by date (newest first)
  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.content.metadata.date);
    const dateB = new Date(b.content.metadata.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <BlogLayout sidebar={null}>
      <div className={styles.blogListPage}>
        <h1>{metadata.blogTitle}</h1>

        {/* Tutorial List */}
        <div className={styles.tutorialList}>
          <BlogPostItems items={sortedItems} />
        </div>

        <BlogListPaginator metadata={metadata} />
      </div>
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
