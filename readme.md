# create-freebox-app

Creates an API application to use with a Freebox.

Compatible Freeboxes:

- Freebox Mini 4K
- _Freebox Revolution (untested)_

Read the [Freebox API documentation](https://dev.freebox.fr/sdk/os/login/#) before using.

## Usage

### Requirements

The script uses the following environment variables:

- `FREEBOX_URL` (required): URL where to reach your Freebox
- `APP_ID` (required): Unique identifier for your app
- `APP_NAME` (required): Your app name
- `APP_VERSION` (required): Your app's version
- `DEVICE_NAME` (optional): Where the app will run / be deployed

### Using Docker

This repository comes bundled as a Docker image for convenience:

```shell
$ docker run                          \
  -it                                 \
  --rm                                \
  -e FREEBOX_URL="http://192.168.1.1" \
  -e APP_ID="com.example.my-app"      \
  -e APP_NAME="My App"                \
  -e APP_VERSION="1.2.3"              \
  -e DEVICE_NAME="NAS"                \
  47ng/create-freebox-app
```

### Using Node.js

1. Install dependencies

```shell
$ yarn install
or
$ npm install
```

2. Setup your environment

Create a `.env` file next to `package.json`, with the contents (customize to your needs):

```zsh
FREEBOX_URL="http://192.168.1.1"
APP_ID="com.example.my-app"
APP_NAME="My App"
APP_VERSION="1.2.3"
DEVICE_NAME="NAS"
```

3. Run the script:

```shell
$ yarn start
or
$ npm run start
```

## Tips

Don't forget to stay close to your Freebox to manually accept the app authorization request.

## What next ?

Use your app token to login to the [Freebox API](https://dev.freebox.fr/sdk/os/login/#).

I'm planning on making an express middleware library to facilitate the exchange of session tokens with a Freebox, stay tuned.
