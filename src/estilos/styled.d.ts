import 'styled-components';
import { tema } from './tema';

type TipoTema = typeof tema;

declare module 'styled-components' {
    export interface DefaultTheme extends TipoTema { }
}
