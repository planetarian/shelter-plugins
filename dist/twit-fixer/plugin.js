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
    before
  } = shelter.plugin.scoped.patcher;
  var TWITTER_REGEX = /(?<pre>https?:\/\/)(?:x|(?:(?:v|f)x)?twitter)\.com(?<post>\/\w+\/status\/\d+(?:\/photo(?:\/(?<photonum>\d+)?)?)?)(?:\/en)*(?<query>(?:\?$|[a-zA-Z0-9\.\,\;\?\'\\\+&%\$\=~_\-\*]+))?(?<fragment>#[a-zA-Z0-9\-\.]+)?/gi;
  var unpatch;
  function replaceTwitterLinks(content) {
    if (!content)
      return content;
    const regex = TWITTER_REGEX;
    if (!regex.test(content))
      return content;
    content = content.replace(regex, (match, pre, post) => pre + "fxtwitter.com" + post + "/en");
    if (content.length > 2e3) {
      console.log("Can't replace twitter link; message would be too long.");
      return null;
    }
    console.log("Replaced twitter link: " + content);
    return content;
  }
  function findPatchTarget(m) {
    if (typeof m === "function" && m.prototype?.enqueue && m.prototype?.handleEdit)
      return m.prototype;
    if (m?.enqueue && m?.handleEdit && m?.logger?.name === "MessageQueue")
      return m;
    return null;
  }
  function findMessageQueue() {
    let found;
    webpackChunkdiscord_app.push([[Symbol()], {}, (req) => {
      for (const id in req.c) {
        const exp = req.c[id]?.exports;
        if (!exp)
          continue;
        for (const key of Object.keys(exp)) {
          const t2 = findPatchTarget(exp[key]);
          if (t2)
            found = t2;
        }
        const t = findPatchTarget(exp.default);
        if (t)
          found = t;
      }
    }]);
    return found;
  }
  function onLoad() {
    const target = findMessageQueue();
    if (!target)
      return console.log("[twit-fixer] MessageQueue not found");
    unpatch = before("enqueue", target, (args) => {
      if (args[0]?.type !== 0)
        return;
      try {
        const fixed = replaceTwitterLinks(args[0].message?.content);
        if (fixed != null)
          args[0].message.content = fixed;
      } catch (err) {
        console.log("[twit-fixer] Error replacing twitter links:", err);
      }
    });
    console.log("[twit-fixer] loaded");
  }
  function onUnload() {
    unpatch?.();
    console.log("[twit-fixer] unloaded");
  }
  return __toCommonJS(twit_fixer_exports);
})();
