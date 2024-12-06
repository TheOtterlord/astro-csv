import type { AstroIntegration, DataEntryType, HookParameters } from 'astro'
import { parse, transform } from 'csv/sync'

type SetupHookParams = HookParameters<'astro:config:setup'> & {
	// Add private type defs here
  addDataEntryType: (dataEntryType: DataEntryType) => void
}

type RowItem = string | number | boolean | null

interface CSVIntegrationOptions {
  transform?: (row: RowItem[]) => any[],
  parseOptions?: {}
}

export default function createIntegration(opts: CSVIntegrationOptions): AstroIntegration {
	return {
		name: 'astro-csv',
		hooks: {
			'astro:config:setup': (params) => {
        const { addDataEntryType } = params as SetupHookParams

        addDataEntryType({
          extensions: ['.csv'],
          getEntryInfo: ({ contents }: { fileUrl: URL; contents: string }) => {
            const data = transform(parse(contents, opts.parseOptions ), row => {
              row = row.map((value: string): RowItem => {
                if (value === 'true') return true
                if (value === 'false') return false
                if (value === '') return null
                if (isNaN(Number(value))) return value
                return Number(value)
              })
              return opts.transform ? row.map(opts.transform) : row
            })
            return {
              data: {
                rows: data,
              },
              rawData: contents,
            }
          }
        })
			},
		},
	}
}
