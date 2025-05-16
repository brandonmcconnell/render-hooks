import { addons } from '@storybook/manager-api';
import theme from './Theme';
import './storybook.css';
 
addons.setConfig({
  theme,
});