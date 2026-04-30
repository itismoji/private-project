// this is important to work
import { Readable as _r } from "node:stream";
import { pipeline as _p } from "node:stream/promises";

// private project
export const config = { 
  api: { [Buffer.from('Ym9keVBhcnNlcg==', 'base64').toString()]: false }, 
  supportsResponseStreaming: !!1, 
  maxDuration: 0x3c 
};

const _0x5a1 = process.env[Buffer.from('VEFSR0VUX0RPTUFJTg==', 'base64').toString()] || "";
const _0x2b2 = _0x5a1.replace(/\/$/, "");

// private project
const _0x99x = new Set(['686f7374', '636f6e6e656374696f6e', '6b6565702d616c697665', '70726f78792d61757468656e746963617465', '70726f78792d617574686f72697a6174696f6e', '7465', '747261696c6572', '7472616e736665722d656e636f64696e67', '75706772616465', '666f72776172646564', '782d666f727761726465642d686f7374', '782d666f727761726465642d70726f746f', '782d666f727761726465642d706f7274']
  .map(h => Buffer.from(h, 'hex').toString()));

export default async function _0x_main(_req, _res) {
  if (!_0x2b2) {
    _res.statusCode = 0x1f4;
    return _res.end(Buffer.from('TWlzY29uZmlndXJlZA==', 'base64').toString());
  }

  try {
    const _0x_u = _0x2b2 + _req.url;
    const _0x_h = {};
    let _0x_ip = null;

    Object.keys(_req.headers).forEach(_k => {
      const _lk = _k.toLowerCase();
      const _v = _req.headers[_k];

      if (_0x99x.has(_lk) || _lk.indexOf(Buffer.from('eC12ZXJjZWwt', 'base64').toString()) === 0) return;

      if (_lk === Buffer.from('eC1yZWFsLWlw', 'base64').toString()) {
        _0x_ip = _v;
      } else if (_lk === Buffer.from('eC1mb3J3YXJkZWQtZm9y', 'base64').toString()) {
        if (!_0x_ip) _0x_ip = _v;
      } else {
        _0x_h[_lk] = Array.isArray(_v) ? _v.join(", ") : _v;
      }
    });

    if (_0x_ip) _0x_h[Buffer.from('eC1mb3J3YXJkZWQtZm9y', 'base64').toString()] = _0x_ip;

    const _m = _req.method;
    const _opts = { 
        method: _m, 
        headers: _0x_h, 
        redirect: Buffer.from('bWFudWFs', 'base64').toString() 
    };

    if (!['GET', 'HEAD'].includes(_m)) {
      _opts.body = _r.toWeb(_req);
      _opts.duplex = Buffer.from('aGFsZg==', 'base64').toString();
    }

    const _f = await fetch(_0x_u, _opts);
    _res.statusCode = _f.status;

    for (const [_k, _v] of _f.headers) {
      if (_k.toLowerCase() === Buffer.from('dHJhbnNmZXItZW5jb2Rpbmc=', 'base64').toString()) continue;
      try { _res.setHeader(_k, _v); } catch (_) {}
    }

    _f.body ? await _p(_r.fromWeb(_f.body), _res) : _res.end();

  } catch (_e) {
    if (!_res.headersSent) {
      _res.statusCode = 0x1f6;
      _res.end();
    }
  }
}