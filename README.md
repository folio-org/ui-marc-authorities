# ui-marc-authorities

Copyright (C) 2021-2026 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This is a UI module for administrating authority records.

## Prerequisites

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (at least version 12.20.1)
* [Yarn](https://yarnpkg.com/)

In order to view and log into the platform being served up, a suitable Okapi backend will need to be running. The [Folio testing-backend](https://app.vagrantup.com/folio/boxes/testing-backend) Vagrant box should work if your app does not yet have its own backend module.

## Run your new app

Note that the following commands require that [`stripes-cli`](https://github.com/folio-org/stripes-cli) is installed globally.

Run the following from the ui-marc-authorities directory to serve your new app using a development server:
```
yarn stripes serve
```

Note: When serving up a newly created app that does not have its own backend permissions established, pass the `--hasAllPerms` option to display the app in the UI navigation. For example:
```
yarn stripes serve --hasAllPerms
```

To specify your own tenant ID or to use an Okapi instance other than `http://localhost:9130` pass the `--okapi` and `--tenant` options.
```
yarn stripes serve --okapi http://my-okapi.example.com:9130 --tenant my-tenant-id
```

## Run the tests

Run the included UI tests with the following command:
```
yarn test
```
