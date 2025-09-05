import { httpRouter } from 'convex/server';
import { auth } from './auth';
import { httpAction } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import {
    convertToModelMessages,
    LanguageModel,
    streamText,
    UIMessage,
} from 'ai';
import { google } from '@ai-sdk/google';

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
    path: '/api/chat',
    method: 'POST',
    handler: httpAction(async (ctx, req) => {
        const userId = getAuthUserId(ctx);
        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // These are all the messages from the chat window
        const { messages }: { messages: UIMessage[] } = await req.json();

        // To make request cheaper and use less tokens we will keep context of only last 10 messages in chat
        const contextMessages = messages.slice(-10);

        const result = streamText({
            model: google('gemini-2.5-flash-lite') as LanguageModel,
            system: 'ad',
            messages: convertToModelMessages(contextMessages),
            onError(error) {
                console.log('StreamText Error: ', error);
            },
        });

        console.log('result', result);

        return result.toUIMessageStreamResponse({
            headers: new Headers({
                'Access-Control-Allow-Origin': '*',
                Vary: 'origin',
            }),
        });
    }),
});

http.route({
    path: '/api/chat',
    method: 'OPTIONS',
    handler: httpAction(async (_, request) => {
        const headers = request.headers;
        if (
            headers.get('Origin') !== null &&
            headers.get('Access-Control-Request-Method') !== null &&
            headers.get('Access-Control-Request-Headers') !== null
        ) {
            return new Response(null, {
                headers: new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers':
                        'Content-Type, Digest, Authorization',
                    'Access-Control-Max-Age': '86400',
                }),
            });
        } else {
            return new Response();
        }
    }),
});

export default http;
