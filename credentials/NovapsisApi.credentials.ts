import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class NovapsisApi implements ICredentialType {
  name = 'novapsisApi';
  displayName = 'Novapsis API';
  documentationUrl = 'https://novapsis.com'; // Puedes poner aquí un enlace a tu web o a una futura documentación
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true, // Esto oculta la API Key en la interfaz
      },
      default: '',
      description: 'Tu clave API personal para el servicio de Novapsis.',
    },
  ];
}
