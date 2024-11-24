import Telegram from './Telegram/Telegram';

const WEBHOOK_ENDPOINT = '/tgwebhook';
const VERSION = '1.0.3';
const WEBAPP_URL = 'https://play.usepanda.app/';

const ADMINS = [66443035, 160517059];

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const bot = new Telegram(env.API_TOKEN, env.SECRET_TOKEN);

		const url = new URL(request.url);
		if (url.pathname === WEBHOOK_ENDPOINT) {
			if (env.APP_ENV !== 'development' && request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.SECRET_TOKEN) {
				return new Response('Unauthorized', { status: 403 });
			}

			let body = await request.json();

			bot.onTextMessage('/start', async (msg) => {
				let keyboard = [[{ text: 'Join the party 🪩', web_app: { url: WEBAPP_URL } }]];

				await bot.sendInlineKeyboard(msg.from!.id, 'Hi, I am a bot!', keyboard);
			});

			bot.onTextMessage(/^\/test/, async (msg) => {
				if (ADMINS.includes(msg.from!.id)) {
					const testUrl = msg.text!.replace('/test ', '');

					await bot.sendInlineKeyboard(msg.from!.id, `Launching test server at:\n${testUrl}`, [
						[{ text: 'Open test server 🥷', web_app: { url: testUrl } }],
					]);
				} else {
					await bot.sendMessage(msg.from!.id, "You are not allowed to use this command");
				}
			});

			bot.anyTextHandler = async (msg) => {
				await bot.sendMessage(msg.from!.id, "I don't know what to do with this message");
			};

			ctx.waitUntil(bot.handlerRequest(body));

			return new Response(JSON.stringify({ success: true }));
		} else if (url.pathname === '/registerWebhook') {
			// await bot.setWebhook(request.url.replace('/registerWebhook', '') + WEBHOOK_ENDPOINT);
		} else if (url.pathname === '/getWebhookInfo') {
			const info = await bot.getWebhookInfo();
			return new Response(
				JSON.stringify({
					success: true,
					version: VERSION,
					response: info,
				}),
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Are you looking for the party?',
			}),
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	},
} satisfies ExportedHandler<Env>;
