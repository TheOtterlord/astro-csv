import type { AstroIntegration, ContentEntryType, DataEntryType, HookParameters } from 'astro'
import csv from 'csv/sync'

type SetupHookParams = HookParameters<'astro:config:setup'> & {
	// Add private type defs here
  addDataEntryType: (dataEntryType: DataEntryType) => void
}

type RowItem = string | number | boolean | null

interface CSVIntegrationOptions {
  transform?: (row: RowItem[]) => any[]
}

export default function createIntegration({ transform }: CSVIntegrationOptions): AstroIntegration {
	return {
		name: 'astro-csv',
		hooks: {
			'astro:config:setup': (params) => {
        const { addDataEntryType } = params as SetupHookParams

        addDataEntryType({
          extensions: ['.csv'],
          getEntryInfo: ({ contents }: { fileUrl: URL; contents: string }) => {
            const data = csv.transform(csv.parse(contents), row => {
              row = row.map((value: string): RowItem => {
                if (value === 'true') return true
                if (value === 'false') return false
                if (value === '') return null
                if (isNaN(Number(value))) return value
                return Number(value)
              })
              return transform ? row.map(transform) : row
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
