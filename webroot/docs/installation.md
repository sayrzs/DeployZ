# How to Install DeployZ

Follow these simple steps to get DeployZ running on your computer.

## Check Your Setup

First, make sure you have the right tools:

```bash
node --version
npm --version
```

## Get the Code

```bash
git clone https://github.com/sayrzs/deployz.git
cd deployz
```

## Install Dependencies

```bash
npm install
```

## Set Up Config

```bash
cp config/config.json.example config/config.json
```

## Start DeployZ

```bash
npm start
```

For development mode:

```bash
npm run dev
```

That's it! Your app will be at `http://localhost:3000`.