# Hono Express Adapter

Now `@hono/node-server` have a buildin function `getRequestListener`, this package is no longer needed anymore.

## Installation

```bash
npm install hono-express-adapter
```

## Usage

```javascript
import express from "express";
import { Hono } from "hono";
import { honoAdapter } from "hono-express-adapter";

const server = express();
const hono = new Hono();
hono.get("/ping", (c) => {
    return c.text("pong");
});
server.use(
    '/hono',
    honoAdapter(hono)
)
server.listen(3000);
```

That's it! Now you can access your Hono server at `http://localhost:3000/hono`.
