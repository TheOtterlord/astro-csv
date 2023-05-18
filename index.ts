import type { AstroIntegration, ContentEntryType, DataEntryType, HookParameters } from 'astro';
import csv from 'csv/sync'

type SetupHookParams = HookParameters<'astro:config:setup'> & {
	// Add private type defs here
  addDataEntryType: (dataEntryType: DataEntryType) => void;
};

export default function createIntegration(): AstroIntegration {
	return {
		name: 'astro-csv',
		hooks: {
			'astro:config:setup': (params) => {
        const { config, addDataEntryType } = params as SetupHookParams;

        addDataEntryType({
          extensions: ['.csv'],
          getEntryInfo: ({ contents }: { fileUrl: URL; contents: string }) => {
            const data = csv.transform(csv.parse(contents), row => {
              return row.map((value: any) => {
                if (value === 'true') return true
                if (value === 'false') return false
                if (value === '') return null
                if (isNaN(Number(value))) return value
                return Number(value)
              })
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
	};
}
