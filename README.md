# Quake 3 Arena Parser

The objective of this little project is create a basic API that manipulate the .log file of the game [Quake 3 Arena](https://store.steampowered.com/app/2200/Quake_III_Arena/) and provide routes to get some infos about the .log file.

## Installation

Clone the repository, navigate into the downloaded folder and install the dependencies using one of the following commands:

Yarn

```
yarn
```

npm

```
npm install
```

## Development setup

To run the project use one of the following scripts:

- **start:dev** - Start the development server;
- **start:prod** - Start the development server;
- **test** - Run tests;

_Edit .prettierrc.js if you want to change some the way like identation works (only care about this is you're using [Prettier](https://prettier.io/))._

## Usage

### Endpoints:
- (GET) - **"/games"** - Return all games in the .log file
- (GET) - **"/game/:id"** - Return a game containing the provided ID
- (GET) - **"/ranking"** - Return the ranking of all players by kills

<br />
<br />

_Quake 3 Arena is a trademark of [id Software](https://www.idsoftware.com/en-us/)_