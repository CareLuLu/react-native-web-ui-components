import React from 'react';
import { withTheme } from '../Theme';
import BaseCheckbox from '../Checkbox/BaseCheckbox';

const Radiobox = props => (
  <BaseCheckbox
    type="Radiobox"
    iconChecked="dot-circle-o"
    iconUnchecked="circle-o"
    iconUncheckedContent="\f192"
    {...props}
  />
);

export default withTheme('Radiobox')(Radiobox);
