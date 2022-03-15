[![Ftp deployment](../../actions/workflows/ftp.yml/badge.svg)](https://github.com/internet2000/tournova.fr/actions/workflows/ftp.yml)
[![Github Pages deployment](../../actions/workflows/ghpages.yml/badge.svg)](https://github.com/internet2000/starter-silex-11ty/actions/workflows/ghpages.yml)

# i2k static starter

Tools we use @[Internet 2000](https://internet2000.net/)

* [11ty static site generator](https://www.11ty.dev/) 
* [Silex website builder](https://www.silex.me)
* [forestry headless CMS](https://forestry.io/)
* [snipcart e-commerce](https://snipcart.com/)
* Deployment and hosting on github pages with a Github action or Netlify
* Deployment to any hosting company (FTP) with a Github action

## starter config

This repo contains an [eleventy](https://11ty.dev) website with

* basic structure for a site with tags, products, posts and pages
* optimized images (webP, different sizes, requires modernizr lib to be loaded on the front end)

It also contains a file to use with [Stastic designer](https://design.stastic.net/), a fork of [Silex](https://www.silex.me). This lets you edit the 11ty layouts with a drag and drop interface.

### 11ty

These plugins are preconfigured:

* [sitemap](https://github.com/quasibit/eleventy-plugin-sitemap)
* [splide](https://splidejs.com/) (slideshow)

Here are the available collections:

* `collections.page` which take the content of `content/pages`
* `collections.post` which take the content of `content/posts`
* `collections.product` which take the content of `content/products`
* `collections.categories` which is an array of all the categories found in all your posts and pages and products ([e.g. the categories in this post](./content/posts/2018-01-01-post1.md))

Here are the available includes:

* `collection`: display a list of links, to posts, categories or other collection, this will be useful for navigation and tag cloud, [see the comment here](./_includes/collection.liquid)
* `pagination`: to be documented
* `slideshow`: insert a slideshow which shows the images of the `images` key in the page front matter, [see the comment here](./_includes/slideshow.liquid)
* `tags`: insert a list of page/post/product filtered by category, [see the comment here](./_includes/tags.liquid)

Shortcodes

* `image`: display a responsive image with `{% image item_url, title, 480, 1280000000, 480, elementWidth %}`
* `bg-image`: display a responsive background image on an element with `{% bg-image item_url, '.the-element', 480, 1280000000, 480, elementWidth %}` - this will create a `<style />` tag with css definitions in it, you are supposed to add this shortcode in an HTML box in the page, or in the HEAD editor if on all pages

#### SEO

In order for the sitemap to be generated, add the `URL` secret to your website, and set it to the final website URL. To do so, [open the settings of the website, "secret" section and create the "URL" secret](./settings/secrets/actions/new).

### Forestry

Import this repo in forestry and you will be able to edit pages, posts and products

## Stastic / Silex

In order to edit 11ty layouts, we use [Stastic](https://design.stastic.net), a fork of [Silex](https://www.silex.me) augmented with templates / layout editing features. In stastic you can use 11ty's builtin language "liquid" to create layouts.

Start with the sample site `.silex/example.html`, also called "the starter template". Open it in [Stastic](https://design.stastic.net) and publish at the root of this repo.

In this starter template you have:

* examples of liquid templates/code you can use with this 11ty starter
* the modernizr library is loaded on all pages - see the script tag in the HEAD editor, this is necessary to have the image optimizations working for background images and slideshows

Links:

* stastic latest version is [available online here](https://design.stastic.net/)
* [stastic source code](https://github.com/lexoyo/stastic-designer)
* [Silex documentation](https://github.com/silexlabs/Silex/wiki/)
* [Silex forums to ask for help](https://github.com/silexlabs/Silex/issues/)

## Get started

[This repository](https://github.com/lexoyo/11ty-boilerplate) is a template you can use to create a site with [11ty](https://11ty.dev) and [Stastic](https://github.com/lexoyo/stastic-designer) which is based on [Silex website builder](https://www.silex.me)

Here is how to start:

1. Browse to [this repository](https://github.com/lexoyo/11ty-boilerplate) and click "use this template" (/!\ be sure to select "Include all branches")
1. [In the settings of your new repository, in the "secret" section, create a new secret](./settings/secrets/actions/new), call it `BASE_URL` and set its value to your website path, e.g. `/my-site` if your site will be served on `https://my-name.github.io/my-site` (this path will be used for all links and image URLs, e.g. `<img src="/my-site/assets/image.png">`)
1. Open `.silex/example.html` with [Stastic designer](https://design.stastic.net/)
1. Publish from Stastic designer to the root of this repo (on your local hard drive or in github)
1. Create a page: new file in this repo like [test.md](./test.md), add `layout: YOUR PAGE NAME IN STASTIC`

## local installation

Check the minimum version of node in [.nvmrc](./.nvmrc) or use `nvm i`

```
$ npm i
$ npm run build
```

## build and deploy

Useful env vars on the build server

* `URL` optional website URL
* `BASE_URL` optional base url, when defined it should start with a `/`
* `DEPLOY_TOKEN` for deployment to branch `gh-pages`

## host on github pages

This repository conains an action to deploy on github pages automatically

Here is what you need to do to activate it:

1. Create a [deploy token here](https://github.com/settings/tokens) with the access write `public_repo`
1. [In the settings of the website, "secret" section, create a new secret](./settings/secrets/actions/new), call it `DEPLOY_TOKEN` and paste the token as its value 
1. Enable actions in the settings of the repo and in the "Actions" tab

In order to use a custom domain, open your repository settings, "pages" section, set the custom domain there.

## host on Netlify

All you need to do is go to netlify.com and import your website from github (select this repository and "eleventy" if it asks for a static site generator)

## host on any hosting with FTP deployment

Here is what you need to do to activate it:

1. Enable actions in the settings of the repo and in the "Actions" tab
1. [In the settings of the repository, in the "secret" section, create 1 new secret](./settings/secrets/actions/new), per option: ftp_host, ftp_port, ftp_username, ftp_password, ftp_protocol, ftp_path, ftp_local_path - see the [meaning of each option in the FTP deployment action docs here](https://github.com/marketplace/actions/ftp-deploy#settings)

This is what the secret section should look like:

![settings of the repository, "secret" section, create 1 new secret](https://user-images.githubusercontent.com/715377/149593587-1e5497c0-a52c-49c0-8196-23b87bf67a9b.png)

