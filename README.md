![schwarzdavid.rocks](./logo.jpg)

# schwarzdavid.rocks

> My personal homepage which can be visited at [https://schwarzdavid.rocks](https://schwarzdavid.rocks).

# Table of content

- [Installation and Usage](#installation-and-usage)
  - [For production](#for-production)
  - [For development](#for-developmnent)
- [Checklist](#checklist)
- [Links](#links)
- [License](#license)

# Installation and Usage

You need to have NodeJS >= 6 and NPM installed on your machine.

After cloning the repository, run `npm install && bower install`. All required dependencies will be installed 
automatically. 

#### For production

Run `gulp build` to create fresh production files and point the webserver on the *dist*-Folder. If you're using nginx, 
you might find the [nginx.config](./nginx.config) useful.

#### For development

Run `gulp watch` to create a fresh build and to make gulp watch for new changes in any files. Whenever you make a
change, gulp will automatically compile and build new files. Be carefull if you make any changes to files which will be
included in the *inject.css*. You need to execute `gulp build` manually to apply those changes.

Additionally, if you have PHP installed on your system, you can run `npm run server` to start a webserver instance
running on *localhost:8080* where you can access your local homepage from anywhere in your network subnet.

# Checklist

#### Content

- [ ] Text free from spelling and grammar errors
- [ ] Placeholder text removed
- [ ] Print stylesheet exists and texted
- [x] Favicon and device icons created and displays correctly
- [ ] Footer includes copyright statement
- [ ] 404 page exists and informative

#### SEO & Analytics

- [ ] Page title and meta data included and appropriate
- [ ] XML sitemap has been generated and added to root of website
- [ ] robots.txt is generated and aded to root of website
- [ ] Website can be accessed by search engines
- [x] Google analytics installed
- [ ] HTML microdata added and tested

#### Social

- [ ] OG Tags included across website and appropriate
- [ ] Twitter meta tags included and appropriate
- [ ] Social accounts integrated, linking to correct URLs

#### Markup

- [ ] HTML has passed validation (or known issues noted)
- [ ] CSS/LESS has passed validation (or known issues noted)
- [ ] JS is error free (almost ... its js - it will never be error free)

#### Accessibility

- [ ] Website meets appropriate level of WCAG compliance
- [ ] ARIA Landmark Roles specified
- [ ] Semantic headings and structure used
- [ ] Links are clearly recognisable and have :focus state
- [ ] Images use appropriate ALT text
- [ ] Alternatives provided for users with Javascript disabled
- [ ] Forms have logical layout
- [ ] Associated label for all form controls
- [ ] Colour contrast tested

#### Rendering

- Displays & functions correctly in IE 11
- Displays & functions correctly in Edge 13
- Displays & functions correctly in Firefox (Windows)
- Displays & functions correctly in Firefox (Mac)
- Displays & functions correctly in Chrome (Windows)
- Displays & functions correctly in Chrome (Max)
- Displays & functions correctly on large resolutions

#### Functionality

- [ ] Forms have been tested and processed correctly
- [ ] Required fields have been tested
- [ ] Review input validation (min/max lengths, character limits)
- [ ] Forms send to the correct recipient
- [ ] Forms have confirmation URL or event tracking so submissions can be tracked

#### Optimisation

- [x] Images have been optimized
- [x] CSS is minified and combined (as much as possible)
- [x] JS is minified and combined (as much as possible)
- [ ] Enable gzip compression
- [ ] Ensure only necessary fonts, weights and character sets are installed
- [ ] [Google speed test](https://developers.google.com/speed/pagespeed/insights/) has a better score than 90 on mobile
- [ ] Run [Web page test](http://www.webpagetest.org/) and optimise accordingly
- [ ] Run Chrome Audits test and optimise accordingly 
- [ ] Incorporate CDN / Caching as required

#### Security

- [ ] Secure areas are locked down and not accessible by search engines
- [x] SSL Certificate ist requested

#### Post launch

- [ ] Ensure site is visible to search engines 
- [x] SSL certificates successfully installed
- [ ] Images, media and links reference live URL
- [ ] Webfonts integrated and working correctly on live site
- [ ] Website URL has been submitted to Google
- [ ] Site added to Google Webmaster tools and sitemap submitted
- [ ] Analytics has been setup and integrated into website

# Links

- Checklist by [humaan.com](https://humaan.com/checklist/)
- Icons by [fontawesome.io](http://fontawesome.io/)
- Form inspired by [Codrops](https://tympanus.net/codrops/)
- Project previews inspired by [Nahel Moussi](http://nahelmoussi.com/)

# License

Copyright 2017 by David  Schwarz

Licensed under the [Apache License v2.0](LICENSE)
