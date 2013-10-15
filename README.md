Open Marriage
=============

**The open source website for Leslie Verploegen's and Eric Ferraiuolo's wedding:
<http://leslie-eric.us/>**

Wedding planning is stressful and so is dealing with shitty wedding websites,
I wanted to reduce our stress so I built the best looking wedding website and
easiest RSVP system known to man. Since no other wedding website can compare to
ours, I thought it would be nice to share what I built and open source our
marriage [website].

It should be obvious that this project is for a *very specific wedding*, my
wedding, and it probably won't work well for your wedding (unless you and your
fiancé are named Leslie and Eric). But hey, if you're building a website for
your wedding you can use this project as the high bar of excellence :)


Built With
----------

Even though I hand-crafted every line of code and push every pixel into its
place, there's no way I could have created a wedding website this good without
using some pay-for web services and free open source software.

### Services

* [Heroku][]: Hosting
* [Heroku Postgres][]: Database hosting
* [Adminium][]: Database admin backend via Heroku Add-on
* [MapBox][]: Maps
* [Mailgun][]: Sending and forwarding email via Heroku Add-on
* [Typekit][]: Fancy fonts
* [Pictos][]: Icons as web fonts

### Software

* [Node.js][]: Runs the JavaScripts
* [npm][]: Package management for Node.js packages
* [Bower][]: Package management for client-side packages
* [PostgreSQL][]: Database
* [express][]: Web framework
* [Handlebars.js][]: Templates
* [YUI][]: Client-side JavaScript framework

#### Node.js Packages

* [async][]: Keeps Node.js async stuff sane
* [combohandler][]: Combos assets to minimize number of HTTP requests
* [csv][]: Generates CSV files
* [db-migrate][]: Database migration framework
* [deep-freeze][]: Deep freeze config objects so they can't change
* [express-slash][]: Wrangles trailing slashes in URLs
* [express-state][]: Exposes config and state from server to client
* [express3-handlebars][]: Makes Express + Handlebars = <3
* [pg][]: Postgres driver for Node.js
* [request][]: HTTP client


[Heroku]: http://heroku.com/
[Heroku Postgres]: http://postgres.heroku.com/
[Adminium]: https://www.adminium.io/
[MapBox]: https://www.mapbox.com/
[Mailgun]: http://www.mailgun.com/
[Typekit]: https://typekit.com/
[Pictos]: http://pictos.cc/server/

[Node.js]: http://nodejs.org/
[npm]: https://npmjs.org/
[Bower]: http://bower.io/
[PostgreSQL]: http://www.postgresql.org/
[express]: http://expressjs.com/
[Handlebars.js]: http://handlebarsjs.com/
[YUI]: http://yuilibrary.com/

[async]: https://github.com/caolan/async
[combohandler]: https://github.com/rgrove/combohandler
[csv]: http://www.adaltas.com/projects/node-csv/
[db-migrate]: https://github.com/kunklejr/node-db-migrate
[deep-freeze]: https://github.com/substack/deep-freeze
[express-slash]: https://github.com/ericf/express-slash
[express-state]: https://github.com/yahoo/express-state
[express3-handlebars]: https://github.com/ericf/express3-handlebars
[pg]: https://github.com/brianc/node-postgres
[request]: https://github.com/mikeal/request


Running
-------

### 1. Install Node.js, Postgres, and Foreman.

This app uses Node.js as the runtime platform, Postgres for its database, and
Foreman is a handy utility to configure and run the app locally.

* __Install Node.js__ from <http://nodejs.org/>.
* __Install PostgreSQL__ from <http://www.postgresql.org/download/>.
* __Install Foreman__ from <https://github.com/ddollar/foreman>.

### 2. Create a Postgres database.

This app uses a Postgres database to manage invitations and guests and backs the
RSVP system. Postgres ships with a `createdb` executable that can be used from
your shell like this:

```shell
$ createdb open-marriage
```

See the [Postgres docs][pg-createdb] for more info on creating a new database.

### 3. Clone this Git repo and install dependencies.

Download this app's code by cloning this Git repo (fork it first if you plan to
make changes).

```shell
$ git clone git://github.com/ericf/open-marriage.git
```

Now install of the app's npm and Bower dependencies (note the Bower dependencies
will be installed automatically after the npm dependencies are installed.):

```shell
$ cd open-marriage
$ npm install
```

### 4. Set configuration and environment variables.

The easiest way to configure and run this app locally is to **create a `.env`
file** to hold all the configuration and environment variables, and use Foreman
to run the app (which will load up the `.env` file).

#### Required Variables

These configuration and environment variables need values specified in order for
this app to function:

* `DATABASE_URL`: The URI to the postgres database.
* `INVITATION_SECRET`: Secret string used to encrypt/decrypt the invitation IDs.
* `NODE_ENV`: Signals to app to run in `development` or `production` mode.
* `SESSION_SECRET`: Secret string used to encrypt/decrypt the session cookie.
* `WEB`: The command to run to start the app.

#### Optional Variables

Additionally, values for the following configuration variables can be set to
enhance the app by adding email sending support via Mailgun and fancy fonts and
icons via Typekit and Pictos:

* `MAILGUN_API_SERVER`: Mailgun API endpoint.
* `MAILGUN_DOMAIN`: Mailgun domain associated with your Mailgun account.
* `MAILGUN_API_KEY`: Secret string used to sign Mailgun HTTP requests.
* `PICTOS`: ID of Pictos server icon font set.
* `PORT`: The port the web server should listen on, defaults to 5000.
* `TYPEKIT`: ID of Typekit set.

#### Example `.env` File

The following is **an example `.env` file** which sets all the _required_
variables in the `VARIABLE=value` format:

```
DATABASE_URL=postgres://localhost/open-marriage
INVITATION_SECRET=something very secret
NODE_ENV=development
SESSION_SECRET=something else secret
WEB=npm start
```

### 5. Migrate the database.

At this point you have the app, all its dependencies installed and a blank
Postgres database; it's now time to migrate the database to add all the
necessary tables. Foreman comes in handy here:

```shell
$ foreman run npm run migrate-up
```

### 6. Start the server!

Now you're all ready to start up the web server and start using the app! Again,
Foreman is used to make this easy:

```shell
$ foreman start
```


[pg-createdb]: http://www.postgresql.org/docs/9.3/static/manage-ag-createdb.html


License
-------

Copyright (c) 2013 Eric Ferraiuolo (eferraiuolo@gmail.com).

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
