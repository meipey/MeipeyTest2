const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

// webP support
const modernizrHasWebP = 'html.webp.webp-alpha.webp-lossless'
const modernizrNoWebP = 'html.no-webp'

// cache
const cache = new Set()

// paths
const optimizedFolderName = path.join('optimized')
const _site = path.join(__dirname, '_site')
const optimizedDestPath = path.join(_site, 'optimized')

if(!fs.existsSync(_site)) {
  console.info('create /_site folder', _site)
  fs.mkdirSync(_site)
}

if(!fs.existsSync(optimizedDestPath)) {
  console.info('create /_site/optimized folder', optimizedDestPath)
  fs.mkdirSync(optimizedDestPath)
}

/**
 * @param src, the original image
 * @param mobileBP, number, mobile breakpoint
 * @param desktopBP, number, desktop breakpoint
 * @param mobile, number, size on mobile
 * @param desktop, number, size on desktop
 */
exports.imageShortcode = async function(src, alt, mobileBP, desktopBP, mobile, desktop) {
  if(!src) return 'Missing image, please upload an image in admin'
  const sizes = await generateImages(src, mobileBP, desktopBP, mobile, desktop)
  // default image / the original image
  const defaultSrc = sizes.find(s => !s.breakpoint).images[0].url
  return `
    <picture>${sizes
        // optimized images only
        .filter(s => !!s.breakpoint)
        .sort((i1, i2) => i1.breakpoint - i2.breakpoint)
        .map(size => size.images
          .slice().reverse()
          .map(image => `
      <source srcset="${image.url}" media="(max-width: ${size.breakpoint}px)" type="image/${image.format}">`)
          .join('')
        )
        .join('')
      }
      <img src="${defaultSrc}" loading="lazy" alt="${alt}">
    </picture>
  `
}

/**
 * @param src, the original image
 * @param mobileBP, number, mobile breakpoint
 * @param desktopBP, number, desktop breakpoint
 * @param mobile, number, size on mobile
 * @param desktop, number, size on desktop
 */
exports.bgImageShortcode = async function(src, selector, mobileBP, desktopBP, mobile, desktop) {
  if(!src) return 'Missing image, please upload an image in admin'
  const sizes = await generateImages(src, mobileBP, desktopBP, mobile, desktop)

  const webpInitiale = sizes[0].images.slice(-1)[0].url
  return `<style>
    /* no support for webp */
    ${ modernizrNoWebP } ${selector} {
      background-image: url("${src}");
    }
    /* support for webp */
    ${sizes
    .filter(size => !size.breakpoint) // original size
    .map(size => `
        /* original size in all formats */
        ${modernizrHasWebP} ${selector} {
          ${ size.images
            .map(image => `background-image: url("${image.url}");`) // default image, the original image
            .join('\n          ')
          }
        }
      `)
    .concat(
      //['', '-ms-', '-moz-', '-webkit-']
      ['']
      .map(prefix => sizes
        .filter(size => !!size.breakpoint) // resized images
        .sort((i1, i2) => i2.breakpoint - i1.breakpoint)
        .map(size => `    /* optimized images for breakpoint ${size.breakpoint} with prefix "${prefix}" */
          @media (max-width: ${size.breakpoint}px) {
            /* all formats for width: ${size.width}px */
            ${modernizrHasWebP} ${selector} {
              background-image: ${prefix}image-set(
                ${ size.images
                  .slice().reverse()
                  .map(image => `url("${image.url}")`) // not supported by ff<89: type("image/${image.format}")
                  .join(',\n                ')
                }
              )
            }
          }
        `)
        .join('\n    ')
      )
    )
    .join('\n    ')
  }
  </style>`
}

/**
 * Generate all necessary images
 * @param src, the original image
 * @param mobileBP, number, mobile breakpoint
 * @param desktopBP, number, desktop breakpoint
 * @param mobile, number, size on mobile
 * @param desktop, number, size on desktop
 * @returns {{images: {{url: string, format: string}}, breakpoint?: number}}
 */
async function generateImages(src, mobileBP, desktopBP, mobile, desktop) {
  // validate input
  if(!src) throw new Error('Missing param src')
  if(!mobileBP) throw new Error('Missing param mobileBP')
  if(!desktopBP) throw new Error('Missing param desktopBP')
  if(!mobile) throw new Error('Missing param mobile')
  if(!desktop) throw new Error('Missing param desktop')

  // constants
  const formats = ["jpeg", "webp"]
  const filePath = path.join(__dirname, src)
  const fileExt = path.extname(src)
  const fileName = path.basename(src, fileExt)

  // webp alternative of the initial image
  const webpInitiale = path.join('/', optimizedFolderName, fileName + '.webp')
  const loaded = sharp(filePath)
  loaded.toFile(path.join(optimizedDestPath, fileName + '.webp'))
  const metadata = await loaded.metadata()

  // all other widths
  // build an array of objects descibing all the sizes
  // also create optimized images
  return [{
    images: [{
      url: src,
      format: metadata.format,
      scale: 1,
    }, {
      url: webpInitiale,
      format: 'webp',
      scale: 1,
    }],
  }].concat([{bp: mobileBP, w: mobile}, {bp: desktopBP, w: desktop}]
    .map(({bp, w}) => ({
      width: w,
      breakpoint: bp,
      images: formats
      .map(f => {
        const newFilePath = path.join('/', optimizedFolderName, `${fileName}-${w}.${f}`)
        const newFileAbsPath = path.join(optimizedDestPath, `${fileName}-${w}.${f}`)
        if(!cache.has(newFileAbsPath) && !fs.existsSync(newFileAbsPath)) {
          console.info('Image optimization:', newFilePath)
          sharp(filePath)
            .resize(w)
            .toFile(newFileAbsPath)
        } else {
          // console.info('Image optimization: skip (cached)', newFilePath)
        }
        cache.add(newFileAbsPath, true)
        return {
          url: newFilePath,
          format: f,
          scale: w / metadata.width,
        }
      }),
    }))
    .filter(i => !!i) // remove the null
    .sort((i1, i2) => i1.width - i2.width)
  )
}

