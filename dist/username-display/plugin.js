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

  // plugins/username-display/index.jsx
  var username_display_exports = {};
  __export(username_display_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var {
    flux: {
      dispatcher,
      stores: {
        GuildMemberStore,
        ChannelStore,
        SelectedChannelStore,
        RelationshipStore
      }
    },
    util: {
      getFiber,
      reactFiberWalker
    },
    observeDom
  } = shelter;
  function handleElement(elem) {
    if (elem.dataset.showuname_injected)
      return;
    elem.dataset.showuname_injected = true;
    const message = reactFiberWalker(getFiber(elem), "message", true)?.pendingProps?.message;
    if (!message)
      return;
    const authorId = message?.author?.id;
    const authorUsername = message.author?.username;
    if (!authorUsername || !authorId)
      return;
    const {
      type,
      guild_id
    } = ChannelStore.getChannel(message.channel_id);
    const nick = type ? RelationshipStore.getNickname(authorId) : GuildMemberStore.getNick(guild_id, authorId);
    if (!nick || authorUsername === nick.toLowerCase())
      return;
    elem.firstElementChild.textContent = `${authorUsername} (${nick})`;
  }
  function handleDispatch(payload) {
    if (payload.type === "MESSAGE_CREATE" && payload.channelId !== SelectedChannelStore.getChannelId())
      return;
    const unObserve = observeDom("[id^=message-username-]", (elem) => {
      handleElement(elem);
      unObserve();
    });
    setTimeout(unObserve, 500);
  }
  var triggers = ["MESSAGE_CREATE", "CHANNEL_SELECT", "LOAD_MESSAGES_SUCCESS", "UPDATE_CHANNEL_DIMENSIONS"];
  function onLoad() {
    for (const t of triggers)
      dispatcher.subscribe(t, handleDispatch);
    console.log("username-display loaded");
  }
  function onUnload() {
    for (const t of triggers)
      dispatcher.unsubscribe(t, handleDispatch);
    console.log("username-display unloaded");
  }
  return __toCommonJS(username_display_exports);
})();
