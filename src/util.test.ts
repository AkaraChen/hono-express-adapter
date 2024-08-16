import express from 'express';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import request from 'supertest';
import { expect, test } from 'vitest';
import { honoAdapter } from '.';

test('text response', async () => {
    const app = express();
    app.use(
        '/hono',
        honoAdapter(
            new Hono().all('*', (c) => {
                return c.text('Hello, World!');
            }),
        ),
    );
    await request(app)
        .get('/hono')
        .then((res) => {
            expect(res.text).toBe('Hello, World!');
        });
});

test('json response', async () => {
    const app = express();
    app.use(
        '/hono',
        honoAdapter(
            new Hono().all('*', (c) => {
                return c.json({ hello: 'world' });
            }),
        ),
    );
    await request(app)
        .get('/hono')
        .then((res) => {
            expect(res.body).toEqual({ hello: 'world' });
        });
});

test('stream response', async () => {
    const app = express();
    app.use(
        '/hono',
        honoAdapter(
            new Hono().all('*', async (c) => {
                return streamSSE(c, async (stream) => {
                    stream.writeSSE({
                        data: 'Hello, World!',
                        event: 'message',
                    });
                    setTimeout(() => {
                        stream.writeSSE({
                            data: 'Hello, World!',
                            event: 'message',
                        });
                        stream.close();
                    }, 100);
                });
            }),
        ),
    );
    await request(app)
        .get('/hono')
        .expect('Content-Type', 'text/event-stream')
        .then((response) => {
            expect(response.text).toBe(
                'event: message\ndata: Hello, World!\n\n',
            );
        });
});
