# Astro CSV Integration

Use CSV files as data sources in Astro.

```sh
npx astro add astro-csv
```

## Usage

### Accept any data

```ts
import { defineCollection, z } from 'astro:content';

const sheets = defineCollection({
  type: 'data',
  schema: z.object({
    rows: z.array(z.array(z.string().or(z.number().or(z.boolean()).nullish()))),
  })
});

export const collections = { sheets };
```

### Accept typed data

```ts
import { defineCollection, z } from 'astro:content';

const sheets = defineCollection({
  type: 'data',
  schema: z.object({
    rows: z.array(z.tuple([
      z.string(), // name
      z.string(), // email
      z.number(), // age
    ]))
  })
});

export const collections = { sheets };
```

`astro-csv` currently supports strings, numbers, booleans, and undefined (empty strings). More customizations coming soon!
