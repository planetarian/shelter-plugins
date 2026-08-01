const { before } = shelter.plugin.scoped.patcher;

const TWITTER_REGEX = /(?<pre>https?:\/\/)(?:x|(?:(?:v|f)x)?twitter)\.com(?<post>\/\w+\/status\/\d+(?:\/photo(?:\/(?<photonum>\d+)?)?)?)(?:\/en)*(?<query>(?:\?$|[a-zA-Z0-9\.\,\;\?\'\\\+&%\$\=~_\-\*]+))?(?<fragment>#[a-zA-Z0-9\-\.]+)?/gi;

let unpatch;

function replaceTwitterLinks(content) {
	if (!content) return content;
	const regex = TWITTER_REGEX;
	if (!regex.test(content)) return content;
	content = content.replace(regex, (match, pre, post) => pre + "fxtwitter.com" + post + "/en");
	if (content.length > 2000) {
		console.log("Can't replace twitter link; message would be too long.");
		return null;
	}
	console.log("Replaced twitter link: " + content);
	return content;
}

// shelter's http interceptor is not working, so we need a different way of intercepting messages.
// This method patches MessageQueue's enqueue which is about as narrow a scope as we can hope for at the moment.

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
			if (!exp) continue;
			for (const key of Object.keys(exp)) {
				const t = findPatchTarget(exp[key]);
				if (t) found = t;
			}
			const t = findPatchTarget(exp.default);
			if (t) found = t;
		}
	}]);
	return found;
}

export function onLoad() {
	const target = findMessageQueue();
	if (!target) return console.log("[twit-fixer] MessageQueue not found");

	unpatch = before("enqueue", target, (args) => {
		if (args[0]?.type !== 0) return;
		try {
			const fixed = replaceTwitterLinks(args[0].message?.content);
			if (fixed != null) args[0].message.content = fixed;
		}
		catch (err) {
			console.log("[twit-fixer] Error replacing twitter links:", err);
		}
	});
	console.log("[twit-fixer] loaded");
}

export function onUnload() {
	unpatch?.();
	console.log("[twit-fixer] unloaded");
}
