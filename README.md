![schwarzdavid.rocks](./logo.jpg)

# schwarzdavid.rocks

> My personal homepage which can be visited at [https://schwarzdavid.rocks](https://schwarzdavid.rocks).

# Table of content

- [Installation and Usage](#installation-and-usage)
  - [For production](#for-production)
  - [For development](#for-developmnent)
- [Links](#links)
- [License](#license)

# Installation and Usage

You need to have NodeJS >= 6 and NPM installed on your machine.

After cloning the repository, run `npm install && bower install`. All required dependencies will be installed 
automatically. 

#### For production

Run `gulp build` to create fresh production files and point the webserver to the *dist*-Folder. If you're using nginx, 
you might find the [nginx.config](./nginx.config) useful.

#### For development

Run `gulp watch` to create a fresh build and to make gulp watch for new changes in any files. Whenever you make a
change, gulp will automatically compile and build new files. Be carefull if you make any changes to files which will be
included in the *inject.css*. You need to execute `gulp build` manually to apply those changes.

Additionally, if you have PHP installed on your system, you can run `npm run server` to start a webserver instance
running on *localhost:8080* where you can access your local homepage from anywhere in your network subnet.

# Links

- Checklist by [humaan.com](https://humaan.com/checklist/)
- Icons by [fontawesome.io](http://fontawesome.io/)
- Form inspired by [Codrops](https://tympanus.net/codrops/)
- Project previews inspired by [Nahel Moussi](http://nahelmoussi.com/)
- Imprint by [Twigg](https://www.twigg.de/)

# License

Copyright 2017 by David  Schwarz

Licensed under the [Apache License v2.0](LICENSE)
