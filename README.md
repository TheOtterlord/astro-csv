# Astro CSV Integration

Use CSV files as data sources in Astro.

## Install

```sh
npx astro add astro-csv
```

### Manual install

```sh
npm i astro-csv
```

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config'
import astroCSV from 'astro-csv'

export default defineConfig({
  integrations: [
    astroCSV()
  ]
})
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
