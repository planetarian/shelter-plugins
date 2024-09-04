(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugins/twit-fixer/index.jsx
  var twit_fixer_exports = {};
  __export(twit_fixer_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var {
    http: {
      intercept
    }
  } = shelter;
  var unintercept;
  async function handleDispatch(req, send) {
    console.log("req:");
    console.log(req);
    try {
      let content = req.body.content;
      let regex = /(?<pre>https?:\/\/)(?:x|(?:(?:v|f)x)?twitter)\.com(?<post>\/\w+\/status\/\d+(?:\/photo(?:\/(?<photonum>\d+)?)?)?)(?:\/en)*(?<query>(?:\?$|[a-zA-Z0-9\.\,\;\?\'\\\+&%\$\=~_\-\*]+))?(?<fragment>#[a-zA-Z0-9\-\.]+)?/gi;
      if (content && regex.test(content)) {
        const replace = (match, pre, post, photonum, query, fragment, rest) => pre + "fxtwitter.com" + post + "/en";
        content = content.replace(regex, replace);
        if (content.length > 2e3) {
          console.log("Can't replace twitter link; message would be too long.");
          return;
        }
        req.body.content = content;
        console.log("Replaced twitter link: " + content);
      }
    } catch (err) {
      console.log(err);
    }
    return await send(req);
  }
  function onLoad() {
    unintercept = intercept("post", /\/channels\/\d+\/messages/, handleDispatch);
    console.log("twit-fixer loaded");
  }
  function onUnload() {
    unintercept();
    console.log("twit-fixer unloaded");
  }
  return __toCommonJS(twit_fixer_exports);
})();
