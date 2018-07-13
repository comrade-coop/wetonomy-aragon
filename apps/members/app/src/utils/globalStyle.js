import styledNormalize from 'styled-normalize'
import {injectGlobal} from 'styled-components'

injectGlobal `
  ${styledNormalize}

  body {
    font-family: sans-serif;
  }
`