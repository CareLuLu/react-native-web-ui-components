import { Router, StaticRouter } from 'react-router-dom';
import { isSSR } from '../utils';

const SSR_MODE = isSSR();

export default SSR_MODE ? StaticRouter : Router;
