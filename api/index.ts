import { NowRequest, NowResponse } from "@vercel/node";

import { convert as xhtml2pug } from "xhtml2pug";

interface Convert {
  html: string;
  options: {
    tabs?: boolean;
    nSpaces?: number;
    attrComma?: boolean;
    bodyLess?: boolean;
    doubleQuotes?: boolean;
    encode?: boolean;
    inlineCSS?: boolean
  }
}

const convert = ({ html, options: { tabs, nSpaces, ...options } }: Convert) => {
  return xhtml2pug(html, {
    ...options,
    symbol: tabs ? '\t' : ' '.repeat(nSpaces)
  })
}

export default (req: NowRequest, res: NowResponse) => {
  if (!req.body) return res.status(401).json({ message: 'empty body' })

  res.json({
    convert: convert(req.body),
  });
};
