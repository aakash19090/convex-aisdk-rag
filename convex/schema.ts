import { authTables } from '@convex-dev/auth/server';
import { defineSchema } from 'convex/server';

const schema = defineSchema({
    ...authTables,
    // Your other tables go here
});

export default schema;
