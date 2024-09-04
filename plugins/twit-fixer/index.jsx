const {
	http: {
		intercept
	}
} = shelter;

var unintercept;

async function handleDispatch(req, send) {
    // only listen for message_create in the current channel
	console.log("req:");
	console.log(req);

	try {
		let content = req.body.content;
		let regex = /(?<pre>https?:\/\/)(?:x|(?:(?:v|f)x)?twitter)\.com(?<post>\/\w+\/status\/\d+(?:\/photo(?:\/(?<photonum>\d+)?)?)?)(?:\/en)*(?<query>(?:\?$|[a-zA-Z0-9\.\,\;\?\'\\\+&%\$\=~_\-\*]+))?(?<fragment>#[a-zA-Z0-9\-\.]+)?/gi;
		if (content && regex.test(content)) {
			const replace = (match, pre, post, photonum, query, fragment, rest) => pre + "fxtwitter.com" + post + "/en";
			content = content.replace(regex, replace);
			if (content.length > 2000) {
				console.log("Can't replace twitter link; message would be too long.");
				return; 
			}
			req.body.content = content;
			console.log("Replaced twitter link: " + content);
		}
	}
	catch (err) {
		console.log(err);
	}
	
	return await send(req);
}

export function onLoad() { // optional
    unintercept = intercept("post", /\/channels\/\d+\/messages/, handleDispatch);
	console.log("twit-fixer loaded")
}

export function onUnload() { // required
    unintercept();
	console.log("twit-fixer unloaded")
}