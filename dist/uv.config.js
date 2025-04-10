/*global Ultraviolet*/
self.__uv$config = {
  prefix: "https://bare-server-node-ilehuycmw-phucs-projects-2a11ed2b.vercel.app/bare/", // không trỏ domain khác
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv.handler.js",
  client: "/uv.client.js",
  bundle: "/uv.bundle.js",
  config: "/uv.config.js",
  sw: "/uv.sw.js",
};
