import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestOptions,
	NodeOperationError,
} from 'n8n-workflow';
import { icon } from './PowerScraper.icon';



export class PowerScraper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Power Scraper',
		name: 'powerScraper',
		icon: { light: icon, dark: icon }, 
		group: ['Novapsis'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Power Scraper: Una navaja suiza para extraer datos de la web.',
		defaults: {
			name: 'Power Scraper',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'novapsisApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Extract All Links',
						value: 'extractLinks',
						action: 'Extraer todos los enlaces URL',
					},
					{
						name: 'Extract Clean Text',
						value: 'extractText',
						action: 'Extraer texto limpio sin HTML',
					},
					{
						name: 'Extract with CSS Selector',
						value: 'extractSelector',
						action: 'Extraer datos con selector CSS.',
					},
					{
						name: 'Scrape Full HTML',
						value: 'scrapeHTML',
						action: 'Extraer HTML completo de una URL.',
					},
					{
						name: 'Take a Screenshot',
						value: 'takeScreenshot',
						action: 'Tomar captura de pantalla de URL.',
					},
				],
				default: 'scrapeHTML',
			},
			{
				displayName: 'URL to Scrape',
				name: 'urlToScrape',
				type: 'string',
				default: 'https://n8n.io',
				required: true,
				description: 'La página web que quieres procesar',
			},
			{
				displayName: 'CSS Selector',
				name: 'selector',
				type: 'string',
				default: 'h1',
				displayOptions: {
					show: {
						operation: ['extractSelector'],
					},
				},
				description: 'El selector CSS para encontrar los elementos (ej. .titulo, #precio).',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const scraperServiceUrl = 'http://e0scwwgwcwcsgog0gkos8ogc.145.223.102.56.sslip.io';

		const credentials = await this.getCredentials('novapsisApi');
		if (credentials === undefined) {
			throw new NodeOperationError(this.getNode(), 'No se encontraron credenciales de Novapsis API.');
		}
		const apiKey = credentials.apiKey as string;


		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i, '') as string;
				const urlToScrape = this.getNodeParameter('urlToScrape', i, '') as string;

				let endpoint = '/';
				const body: { [key: string]: any } = { url: urlToScrape };
				const options: IHttpRequestOptions = {
					method: 'POST',
					body,
					json: true,
					url: '',
					headers: {
						'X-API-KEY': apiKey,
					},
				};

				if (operation === 'scrapeHTML') {
					endpoint = '/';
				} else if (operation === 'extractText') {
					endpoint = '/text';
				} else if (operation === 'extractLinks') {
					endpoint = '/links';
				} else if (operation === 'extractSelector') {
					endpoint = '/selector';
					body.selector = this.getNodeParameter('selector', i, '') as string;
				} else if (operation === 'takeScreenshot') {
					endpoint = '/screenshot';
					options.json = false;
					options.encoding = 'arraybuffer';
				}

				options.url = `${scraperServiceUrl}${endpoint}`;


				if (operation === 'takeScreenshot') {
					const response = await this.helpers.httpRequest(options);
					const data = Buffer.from(response as ArrayBuffer);
					const binaryData = await this.helpers.prepareBinaryData(data, 'screenshot.png', 'image/png');
					returnData.push({ json: {}, binary: { data: binaryData }, pairedItem: { item: i } });
				} else {
					const response = await this.helpers.httpRequest(options);
					returnData.push({ json: response, pairedItem: { item: i } });
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error);
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
