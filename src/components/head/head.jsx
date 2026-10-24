import React from 'react';
import Head from 'next/head';
import metaConfig from '@/setting/metaConfig.json';


const MetaHead = () => {
  return (
    <Head>
      <meta charSet={metaConfig.charSet} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {Object.entries(metaConfig.meta).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}
      <meta name="description" content={metaConfig.description} />
      <meta property="og:title" content={metaConfig.title} />
      <meta property="og:description" content={metaConfig.description} />
      <meta property="og:image" content={metaConfig.og_image} />
      <link rel="manifest" href={metaConfig.manifest} />
      <link rel="icon" href={metaConfig.icon} />
      <link rel="shortcut icon" href={metaConfig.icon} />
      <link rel="canonical" href={metaConfig.canonical} />
      <link rel="alternate" hrefLang="en" href="" />
      <title>{metaConfig.title}</title>
    </Head>
  );
};

export default MetaHead;