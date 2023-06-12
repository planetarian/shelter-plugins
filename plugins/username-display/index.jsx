const {
	flux: {
		dispatcher,
		stores: {
			GuildMemberStore,
			ChannelStore,
			SelectedChannelStore,
			RelationshipStore,
		},
	},
	util: { getFiber, reactFiberWalker },
	observeDom
} = shelter;

function handleElement(elem) {
	if (elem.dataset.showuname_injected) return;
    elem.dataset.showuname_injected = true;

	const message = reactFiberWalker(getFiber(elem), "message", true)?.pendingProps?.message;
    if (!message) return;
	
	const authorId = msg?.author?.id;
	const authorUsername = msg.author?.username;
	if (!authorUsername || !authorId) return;

	// message: { author: { id, username }, channel_id }
	const { type, guild_id } = ChannelStore.getChannel(message.channel_id);
	
	// type = 0: Guild, 1: DM
	const nick = type
		? RelationshipStore.getNickname(authorId)
		: GuildMemberStore.getNick(guild_id, authorId);

	if (!nick) return;

	elem.firstElementChild.textContent += ` (${authorUsername})`;
 }

function handleDispatch(payload) {
    // only listen for message_create in the current channel
    if (payload.type === "MESSAGE_CREATE" &&
		payload.channelId !== SelectedChannelStore.getChannelId())
        return;
    
    const unObserve = observeDom("[id^=message-username-]", (elem) => {
        handleElement(elem);
        unObserve();
    });
    
	// remove the observation after 500ms to avoid slowly degrading Discord's performance over time
    setTimeout(unObserve, 500);
}

const triggers = ["MESSAGE_CREATE", "CHANNEL_SELECT", "LOAD_MESSAGES_SUCCESS", "UPDATE_CHANNEL_DIMENSIONS"];

export function onLoad() {
	for (const t of triggers) dispatcher.subscribe(t, handleDispatch);
	console.log("username-display loaded")
}

export function onUnload() {
    for (const t of triggers) dispatcher.unsubscribe(t, handleDispatch);
	console.log("username-display unloaded")
}
